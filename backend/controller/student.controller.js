// controller/student.controller.js
// Profile-side actions a logged-in student takes on their own record.
// Unlike auth.controller.js, these run behind authenticate + resolveTenant,
// so req.profile is already the student's own Student document — no
// separate lookup by rollNumber/email needed.

import Student from "../models/Student.js";
import Application from "../models/Application.js";
import { uploadImageToImageKit } from "../utils/imagekit.js";

// Shared by every "upload N images, pair each with a label/number from the
// request body" endpoint below — semester results and generic documents
// both follow this exact shape.
async function uploadPairedFiles(files, folder, fileNameFn) {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadImageToImageKit(files[i].buffer, fileNameFn(i), folder);
    urls.push(url);
  }
  return urls;
}

// ---------- ADD SEMESTER RESULT DOCUMENT(S) ----------
export async function addSemesterResults(req, res, next) {
  try {
    const { semesters } = req.body;
    const files = req.files || []; // from multer's upload.array("semesterResults")

    if (files.length === 0) {
      return res.status(400).json({ message: "At least one result document image is required." });
    }
    if (!semesters) {
      return res.status(400).json({
        message:
          'Provide a "semesters" field (JSON array of semester numbers) matching the uploaded files, in the same order.',
      });
    }

    let semesterNumbers;
    try {
      semesterNumbers = JSON.parse(semesters);
    } catch {
      return res.status(400).json({ message: '"semesters" must be a JSON array, e.g. [1,2,3].' });
    }
    if (!Array.isArray(semesterNumbers) || semesterNumbers.length !== files.length) {
      return res.status(400).json({
        message: "The number of semester numbers must match the number of uploaded files.",
      });
    }
    if (semesterNumbers.some((n) => !Number.isInteger(n) || n < 1)) {
      return res.status(400).json({ message: "Semester numbers must be positive integers." });
    }

    const student = req.profile;
    const rollNumber = student.rollNumber;
    const folder = `/students/${req.workspaceId}/${rollNumber}/semester-results`;

    const urls = await uploadPairedFiles(
      files,
      folder,
      (i) => `${rollNumber}_sem${semesterNumbers[i]}_${Date.now()}`
    );
    const uploaded = urls.map((documentUrl, i) => ({ semester: semesterNumbers[i], documentUrl }));

    const updated = await Student.findOneAndUpdate(
      { _id: student._id, workspaceId: req.workspaceId }, // tenantScope-compliant filter
      { $push: { semesterResults: { $each: uploaded } } },
      { new: true }
    );

    return res.status(200).json({
      message: "Result document(s) added.",
      semesterResults: updated.semesterResults,
    });
  } catch (err) {
    next(err);
  }
}

// ---------- ADD OTHER REQUIRED DOCUMENT(S) (resume, ID proof, certificates, etc.) ----------
export async function addDocuments(req, res, next) {
  try {
    const { labels } = req.body;
    const files = req.files || []; // from multer's upload.array("documents")

    if (files.length === 0) {
      return res.status(400).json({ message: "At least one document image is required." });
    }
    if (!labels) {
      return res.status(400).json({
        message:
          'Provide a "labels" field (JSON array of strings) matching the uploaded files, in the same order — e.g. ["resume","idProof"].',
      });
    }

    let documentLabels;
    try {
      documentLabels = JSON.parse(labels);
    } catch {
      return res.status(400).json({ message: '"labels" must be a JSON array of strings.' });
    }
    if (!Array.isArray(documentLabels) || documentLabels.length !== files.length) {
      return res.status(400).json({ message: "The number of labels must match the number of uploaded files." });
    }
    if (documentLabels.some((l) => typeof l !== "string" || !l.trim())) {
      return res.status(400).json({ message: "Each label must be a non-empty string." });
    }

    const student = req.profile;
    const rollNumber = student.rollNumber;
    const folder = `/students/${req.workspaceId}/${rollNumber}/documents`;

    const urls = await uploadPairedFiles(
      files,
      folder,
      (i) => `${rollNumber}_${documentLabels[i].trim().replace(/\s+/g, "_")}_${Date.now()}`
    );
    const uploaded = urls.map((documentUrl, i) => ({
      label: documentLabels[i].trim(),
      documentUrl,
    }));

    const updateOps = { $push: { documents: { $each: uploaded } } };

    // A document explicitly labelled "resume" also updates the dedicated
    // resumeUrl field, so existing code/UI reading that field directly
    // (e.g. a TPO's applicant list) doesn't need to know about `documents`.
    const resumeUpload = uploaded.find((d) => d.label.toLowerCase() === "resume");
    if (resumeUpload) {
      updateOps.resumeUrl = resumeUpload.documentUrl;
    }

    const updated = await Student.findOneAndUpdate(
      { _id: student._id, workspaceId: req.workspaceId }, // tenantScope-compliant filter
      updateOps,
      { new: true }
    );

    return res.status(200).json({
      message: "Document(s) added.",
      documents: updated.documents,
      resumeUrl: updated.resumeUrl,
    });
  } catch (err) {
    next(err);
  }
}

// ---------- ADD/UPDATE GITHUB & LINKEDIN LINKS ----------
const GITHUB_URL_REGEX = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9-]+\/?$/;
const LINKEDIN_URL_REGEX = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?$/;

export async function updateSocialLinks(req, res, next) {
  try {
    const { githubUrl, linkedinUrl } = req.body;
    const updates = {};

    if (githubUrl !== undefined) {
      if (githubUrl && !GITHUB_URL_REGEX.test(githubUrl)) {
        return res
          .status(400)
          .json({ message: "Enter a valid GitHub profile URL, e.g. https://github.com/username." });
      }
      updates.githubUrl = githubUrl || null;
    }

    if (linkedinUrl !== undefined) {
      if (linkedinUrl && !LINKEDIN_URL_REGEX.test(linkedinUrl)) {
        return res
          .status(400)
          .json({ message: "Enter a valid LinkedIn profile URL, e.g. https://linkedin.com/in/username." });
      }
      updates.linkedinUrl = linkedinUrl || null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Provide at least one field to update (githubUrl, linkedinUrl)." });
    }

    const updated = await Student.findOneAndUpdate(
      { _id: req.profile._id, workspaceId: req.workspaceId }, // tenantScope-compliant filter
      updates,
      { new: true }
    );

    return res.status(200).json({
      message: "Profile links updated.",
      githubUrl: updated.githubUrl,
      linkedinUrl: updated.linkedinUrl,
    });
  } catch (err) {
    next(err);
  }
}

// ---------- VIEW OWN PROFILE ----------
export async function getMyProfile(req, res, next) {
  try {
    const student = req.profile;

    const applications = await Application.find({
      studentId: student._id,
      workspaceId: req.workspaceId,
    })
      .populate("jobPostingId", "title role companyId status")
      .sort({ appliedAt: -1 });

    return res.status(200).json({
      profile: {
        // Phase 1 — TPO-uploaded roster
        rollNumber: student.rollNumber,
        name: student.name,
        departmentCode: student.departmentCode,
        cgpa: student.cgpa,
        backlogs: student.backlogs,
        passingYear: student.passingYear,

        // Phase 2 — self-registration
        phone: student.phone,
        status: student.status,
        email: req.user.email, // lives on User, not Student — merged in here

        // Post-login profile actions
        resumeUrl: student.resumeUrl,
        githubUrl: student.githubUrl,
        linkedinUrl: student.linkedinUrl,
        semesterResults: student.semesterResults,
        documents: student.documents,
        isPlaced: student.isPlaced,

        // Companies/drives applied to
        applications,
      },
    });
  } catch (err) {
    next(err);
  }
}