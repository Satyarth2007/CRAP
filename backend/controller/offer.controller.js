// controller/offer.controller.js
import mongoose from "mongoose";
import Offer from "../models/Offer.js";
import Application from "../models/Application.js";
import JobPosting from "../models/JobPosting.js";
import Student from "../models/Student.js";
import { getScopedWorkspaceId } from "../utils/scopeHelpers.js";
import { notify } from "../utils/notify.js";

const ACTIVE_APPLICATION_STATUSES = ["applied", "shortlisted", "interview"];

// ---------- HR ISSUES AN OFFER FOR A SELECTED APPLICATION ----------
export async function createOffer(req, res, next) {
  try {
    const { applicationId, ctc } = req.body;
    const workspaceId = getScopedWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }
    if (!applicationId) {
      return res.status(400).json({ message: "applicationId is required." });
    }

    const application = await Application.findOne({ _id: applicationId, workspaceId });
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }
    if (application.status !== "selected") {
      return res.status(409).json({
        message: `Cannot issue an offer — application status is "${application.status}", not "selected".`,
      });
    }

    const jobPosting = await JobPosting.findOne({ _id: application.jobPostingId, workspaceId });
    if (!jobPosting || jobPosting.companyId.toString() !== req.profile.companyId.toString()) {
      return res.status(403).json({ message: "Not authorized for this application." });
    }

    const existingOffer = await Offer.findOne({ applicationId, workspaceId });
    if (existingOffer) {
      return res.status(409).json({
        message: `An offer already exists for this application (status: "${existingOffer.status}").`,
      });
    }

    const offer = await Offer.create({
      studentId: application.studentId,
      applicationId,
      jobPostingId: jobPosting._id,
      companyId: jobPosting.companyId,
      workspaceId,
      ctc: ctc ?? jobPosting.ctc,
      status: "pending",
    });

    const student = await Student.findById(application.studentId, { userId: 1 });
    if (student?.userId) {
      await notify(workspaceId, student.userId, {
        type: "offer_issued",
        title: `Offer received: ${jobPosting.title}`,
        message: `You've received an offer. Log in to review and respond.`,
        relatedModel: "Offer",
        relatedId: offer._id,
      });
    }

    return res.status(201).json({ offer });
  } catch (err) {
    next(err);
  }
}

// ---------- STUDENT VIEWS THEIR OWN OFFERS ----------
export async function listMyOffers(req, res, next) {
  try {
    const offers = await Offer.find({ studentId: req.profile._id, workspaceId: req.workspaceId })
      .populate("jobPostingId", "title role")
      .populate("companyId", "name logoUrl")
      .sort({ issuedAt: -1 });

    return res.status(200).json({ offers });
  } catch (err) {
    next(err);
  }
}

// ---------- STUDENT ACCEPTS OR DECLINES AN OFFER ----------
// Accepting is the one place the one-offer rule and auto-withdrawal
// actually fire. The Offer.status unique partial index is the real
// enforcement — this transaction is belt, the index is suspenders: if two
// requests somehow both get past the "status !== pending" guard, the
// second write to hit the DB throws a duplicate-key error and the whole
// transaction rolls back.
export async function respondToOffer(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { offerId } = req.params;
    const { accept } = req.body; // boolean

    if (typeof accept !== "boolean") {
      return res.status(400).json({ message: '"accept" must be true or false.' });
    }

    const offer = await Offer.findOne({
      _id: offerId,
      studentId: req.profile._id,
      workspaceId: req.workspaceId,
    });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found." });
    }
    if (offer.status !== "pending") {
      return res.status(409).json({
        message: `This offer has already been responded to (status: "${offer.status}").`,
      });
    }

    if (!accept) {
      offer.status = "declined";
      offer.respondedAt = new Date();
      await offer.save();
      return res.status(200).json({ offer });
    }

    session.startTransaction();

    offer.status = "accepted";
    offer.respondedAt = new Date();
    await offer.save({ session });

    // Auto-withdraw every other still-active application for this student.
    await Application.updateMany(
      {
        studentId: req.profile._id,
        workspaceId: req.workspaceId,
        _id: { $ne: offer.applicationId },
        status: { $in: ACTIVE_APPLICATION_STATUSES },
      },
      {
        $set: { status: "withdrawn", currentStage: null },
        $push: { stageHistory: { stage: "Auto-withdrawn", status: "withdrawn", date: new Date() } },
      },
      { session }
    );

    // Also close out any other pending offers, so nothing dangling implies
    // the student is still deciding elsewhere. Not explicitly in the
    // locked architecture note (which only mentions applications) — flag
    // if you'd rather leave other pending offers untouched.
    await Offer.updateMany(
      {
        studentId: req.profile._id,
        workspaceId: req.workspaceId,
        _id: { $ne: offer._id },
        status: "pending",
      },
      { $set: { status: "withdrawn", respondedAt: new Date() } },
      { session }
    );

    await Student.findOneAndUpdate(
      { _id: req.profile._id, workspaceId: req.workspaceId },
      { isPlaced: true },
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({ offer });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already have an accepted offer." });
    }
    next(err);
  } finally {
    session.endSession();
  }
}

// ---------- HR WITHDRAWS A PENDING OFFER ----------
export async function withdrawOffer(req, res, next) {
  try {
    const { offerId } = req.params;
    const workspaceId = getScopedWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    const offer = await Offer.findOne({ _id: offerId, workspaceId });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found." });
    }
    if (offer.companyId.toString() !== req.profile.companyId.toString()) {
      return res.status(403).json({ message: "Not authorized for this offer." });
    }
    if (offer.status !== "pending") {
      return res.status(409).json({ message: `Cannot withdraw — offer status is already "${offer.status}".` });
    }

    offer.status = "withdrawn";
    offer.respondedAt = new Date();
    await offer.save();

    return res.status(200).json({ offer });
  } catch (err) {
    next(err);
  }
}

// ---------- TPO / HR VIEW OFFERS FOR A JOB POSTING ----------
export async function listOffersForJobPosting(req, res, next) {
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

    const offers = await Offer.find({ jobPostingId, workspaceId })
      .populate("studentId", "rollNumber name departmentCode")
      .sort({ issuedAt: -1 });

    return res.status(200).json({ offers });
  } catch (err) {
    next(err);
  }
}