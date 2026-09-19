// controller/application.controller.js
import Application from "../models/Application.js";
import JobPosting from "../models/JobPosting.js";
import Student from "../models/Student.js";
import { checkEligibility } from "../utils/eligibility.js";
import { getScopedWorkspaceId } from "../utils/scopeHelpers.js";
import { notify } from "../utils/notify.js";

const STATUSES = ["applied", "shortlisted", "interview", "selected", "rejected", "withdrawn"];
const TERMINAL_STATUSES = ["selected", "rejected", "withdrawn"];

// ---------- STUDENT APPLIES TO A JOB POSTING ----------
export async function createApplication(req, res, next) {
  try {
    const { jobPostingId } = req.body;
    if (!jobPostingId) {
      return res.status(400).json({ message: "jobPostingId is required." });
    }

    const jobPosting = await JobPosting.findOne({
      _id: jobPostingId,
      workspaceId: req.workspaceId, // Student — tenantScope-compliant, own workspace only
      status: "open",
    });
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found or not currently open." });
    }

    if (jobPosting.applicationDeadline && new Date() > jobPosting.applicationDeadline) {
      return res.status(400).json({ message: "The application deadline for this drive has passed." });
    }

    const { eligible, reasons } = checkEligibility(req.profile, jobPosting.eligibility);
    if (!eligible) {
      return res.status(403).json({ message: "You are not eligible for this drive.", reasons });
    }

    const existing = await Application.findOne({
      studentId: req.profile._id,
      jobPostingId,
      workspaceId: req.workspaceId,
    });
    if (existing) {
      return res.status(409).json({ message: "You have already applied to this drive." });
    }

    const application = await Application.create({
      studentId: req.profile._id,
      jobPostingId,
      workspaceId: req.workspaceId,
      status: "applied",
      currentStage: null,
      stageHistory: [{ stage: "Application Submitted", status: "applied", date: new Date() }],
    });

    return res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
}

// ---------- STUDENT VIEWS THEIR OWN APPLICATIONS ----------
export async function listMyApplications(req, res, next) {
  try {
    const applications = await Application.find({
      studentId: req.profile._id,
      workspaceId: req.workspaceId,
    })
      .populate("jobPostingId", "title role ctc companyId status applicationDeadline driveDate")
      .sort({ appliedAt: -1 });

    return res.status(200).json({ applications });
  } catch (err) {
    next(err);
  }
}

// ---------- STUDENT WITHDRAWS AN APPLICATION ----------
export async function withdrawApplication(req, res, next) {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({
      _id: applicationId,
      studentId: req.profile._id,
      workspaceId: req.workspaceId,
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }
    if (TERMINAL_STATUSES.includes(application.status)) {
      return res.status(409).json({ message: `Cannot withdraw — this application is already "${application.status}".` });
    }

    application.status = "withdrawn";
    application.currentStage = null;
    application.stageHistory.push({ stage: "Withdrawn", status: "withdrawn", date: new Date() });
    await application.save();

    return res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
}

// ---------- TPO / HR VIEW APPLICATIONS FOR A JOB POSTING ----------
export async function listApplicationsForJobPosting(req, res, next) {
  try {
    const { jobPostingId } = req.params;
    const workspaceId = getScopedWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    const jobPosting = await JobPosting.findOne({ _id: jobPostingId, workspaceId });
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found." });
    }
    if (req.role === "HR" && jobPosting.companyId.toString() !== req.profile.companyId.toString()) {
      return res.status(403).json({ message: "This job posting belongs to a different company." });
    }

    const applications = await Application.find({ jobPostingId, workspaceId })
      .populate("studentId", "rollNumber name departmentCode cgpa backlogs resumeUrl")
      .sort({ appliedAt: -1 });

    return res.status(200).json({ applications });
  } catch (err) {
    next(err);
  }
}

// ---------- HR MOVES AN APPLICATION THROUGH STAGES ----------
export async function updateApplicationStage(req, res, next) {
  try {
    const { applicationId } = req.params;
    const { status, stage } = req.body;
    const workspaceId = getScopedWorkspaceId(req); // HR — required explicitly

    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }
    if (!STATUSES.includes(status) || status === "applied") {
      return res.status(400).json({
        message: `status must be one of: ${STATUSES.filter((s) => s !== "applied").join(", ")}.`,
      });
    }

    const application = await Application.findOne({ _id: applicationId, workspaceId });
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }
    if (TERMINAL_STATUSES.includes(application.status)) {
      return res.status(409).json({ message: `This application has already reached a final status ("${application.status}").` });
    }

    const jobPosting = await JobPosting.findOne({ _id: application.jobPostingId, workspaceId });
    if (!jobPosting || jobPosting.companyId.toString() !== req.profile.companyId.toString()) {
      return res.status(403).json({ message: "Not authorized for this application." });
    }

    const roundNames = jobPosting.interviewRounds.map((r) => r.name);
    if (["shortlisted", "interview"].includes(status)) {
      if (!stage || !roundNames.includes(stage)) {
        return res.status(400).json({
          message: `stage must be one of the configured interview rounds: ${roundNames.join(", ") || "(none configured)"}.`,
        });
      }
    }

    const terminalLabels = { selected: "Selected", rejected: "Rejected", withdrawn: "Withdrawn" };
    const resolvedStage = stage || terminalLabels[status] || status;

    application.status = status;
    application.currentStage = TERMINAL_STATUSES.includes(status) ? null : resolvedStage;
    application.stageHistory.push({ stage: resolvedStage, status, date: new Date() });
    await application.save();

    const student = await Student.findById(application.studentId, { userId: 1 });
    if (student?.userId) {
      await notify(workspaceId, student.userId, {
        type: "application_status_change",
        title: `Application update: ${jobPosting.title}`,
        message: `Your application is now "${status}"${resolvedStage ? ` (${resolvedStage})` : ""}.`,
        relatedModel: "Application",
        relatedId: application._id,
      });
    }

    return res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
}