// controller/jobPosting.controller.js
import JobPosting from "../models/JobPosting.js";
import Connection from "../models/Connection.js";
import { getScopedWorkspaceId } from "../utils/scopeHelpers.js";

const EDITABLE_FIELDS = [
  "title",
  "description",
  "role",
  "ctc",
  "eligibility",
  "applicationDeadline",
  "driveDate",
];

// ---------- HR CREATES A JOB POSTING (draft) ----------
export async function createJobPosting(req, res, next) {
  try {
    const { workspaceId, title, description, role, ctc, eligibility, applicationDeadline, driveDate } =
      req.body;

    if (!workspaceId || !title || !eligibility) {
      return res.status(400).json({ message: "workspaceId, title, and eligibility are required." });
    }

    const connection = await Connection.findOne({
      companyId: req.profile.companyId,
      workspaceId,
      status: "approved",
    });
    if (!connection) {
      return res.status(403).json({
        message: "Your company isn't connected (or the connection isn't yet approved) with this college.",
      });
    }

    const posting = await JobPosting.create({
      companyId: req.profile.companyId,
      workspaceId,
      title,
      description,
      role,
      ctc,
      eligibility,
      applicationDeadline,
      driveDate,
      createdBy: req.profile._id,
      status: "draft",
    });

    return res.status(201).json({ jobPosting: posting });
  } catch (err) {
    next(err);
  }
}

// ---------- HR UPDATES A DRAFT JOB POSTING ----------
// Restricted to "draft" status — once TPO has opened the drive, the
// content shouldn't shift under students who've already seen it.
export async function updateJobPosting(req, res, next) {
  try {
    const { jobPostingId } = req.params;
    const workspaceId = req.body.workspaceId || req.query.workspaceId;
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    const posting = await JobPosting.findOne({
      _id: jobPostingId,
      workspaceId, // tenantScope-compliant filter
      companyId: req.profile.companyId,
    });
    if (!posting) {
      return res.status(404).json({ message: "Job posting not found." });
    }
    if (posting.status !== "draft") {
      return res.status(409).json({ message: "Only draft postings can be edited." });
    }

    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        posting[field] = req.body[field];
      }
    }
    await posting.save();

    return res.status(200).json({ jobPosting: posting });
  } catch (err) {
    next(err);
  }
}

// ---------- TPO SETS/REPLACES INTERVIEW ROUNDS ----------
export async function setInterviewRounds(req, res, next) {
  try {
    const { jobPostingId } = req.params;
    const { rounds } = req.body; // [{ name, order }, ...]

    if (!Array.isArray(rounds) || rounds.length === 0) {
      return res.status(400).json({ message: "Provide a non-empty array of rounds: [{ name, order }]." });
    }
    const valid = rounds.every(
      (r) => typeof r.name === "string" && r.name.trim() && Number.isInteger(r.order)
    );
    if (!valid) {
      return res.status(400).json({ message: "Each round needs a non-empty name and an integer order." });
    }

    const posting = await JobPosting.findOne({
      _id: jobPostingId,
      workspaceId: req.workspaceId, // TPO — tenantScope-compliant filter
    });
    if (!posting) {
      return res.status(404).json({ message: "Job posting not found." });
    }

    posting.interviewRounds = rounds
      .map((r) => ({ name: r.name.trim(), order: r.order }))
      .sort((a, b) => a.order - b.order);
    await posting.save();

    return res.status(200).json({ jobPosting: posting });
  } catch (err) {
    next(err);
  }
}

// ---------- TPO OPENS A DRIVE (draft -> open) ----------
export async function openDrive(req, res, next) {
  try {
    const { jobPostingId } = req.params;

    const posting = await JobPosting.findOne({ _id: jobPostingId, workspaceId: req.workspaceId });
    if (!posting) {
      return res.status(404).json({ message: "Job posting not found." });
    }
    if (posting.status !== "draft") {
      return res.status(409).json({ message: `Cannot open a posting that is currently "${posting.status}".` });
    }
    if (!posting.interviewRounds || posting.interviewRounds.length === 0) {
      return res.status(400).json({ message: "Configure interview rounds before opening this drive." });
    }

    posting.status = "open";
    await posting.save();

    return res.status(200).json({ jobPosting: posting });
  } catch (err) {
    next(err);
  }
}

// ---------- TPO CLOSES A DRIVE (open -> closed) ----------
export async function closeDrive(req, res, next) {
  try {
    const { jobPostingId } = req.params;

    const posting = await JobPosting.findOne({ _id: jobPostingId, workspaceId: req.workspaceId });
    if (!posting) {
      return res.status(404).json({ message: "Job posting not found." });
    }
    if (posting.status !== "open") {
      return res.status(409).json({ message: `Cannot close a posting that is currently "${posting.status}".` });
    }

    posting.status = "closed";
    await posting.save();

    return res.status(200).json({ jobPosting: posting });
  } catch (err) {
    next(err);
  }
}

// ---------- LIST JOB POSTINGS ----------
// TPO: everything in their workspace. HR: their company's own postings
// (workspaceId still required — see utils/scopeHelpers.js). Student:
// only "open" postings in their workspace — NOT yet filtered by
// eligibility; that's the eligibility engine, a separate build.
export async function listJobPostings(req, res, next) {
  try {
    const workspaceId = getScopedWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    const filter = { workspaceId };
    if (req.role === "HR") {
      filter.companyId = req.profile.companyId;
    }
    if (req.role === "Student") {
      filter.status = "open";
    } else if (req.query.status) {
      filter.status = req.query.status;
    }

    const postings = await JobPosting.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ jobPostings: postings });
  } catch (err) {
    next(err);
  }
}

// ---------- GET JOB POSTING BY ID ----------
export async function getJobPostingById(req, res, next) {
  try {
    const { jobPostingId } = req.params;
    const workspaceId = getScopedWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    const filter = { _id: jobPostingId, workspaceId };
    if (req.role === "HR") {
      filter.companyId = req.profile.companyId;
    }
    if (req.role === "Student") {
      filter.status = "open"; // students can't view draft/closed postings by id either
    }

    const posting = await JobPosting.findOne(filter);
    if (!posting) {
      return res.status(404).json({ message: "Job posting not found." });
    }

    return res.status(200).json({ jobPosting: posting });
  } catch (err) {
    next(err);
  }
}