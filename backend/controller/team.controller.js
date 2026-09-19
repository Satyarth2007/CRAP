// controller/team.controller.js
// Authenticated actions where an existing TPO/HR brings someone new onto
// the platform. Distinct from auth.controller.js: these are performed BY
// a logged-in user ON someone else's account, not self-service.

import mongoose from "mongoose";
import User from "../models/User.js";
import TPO from "../models/TPO.js";
import HR from "../models/HR.js";
import HoD from "../models/HoD.js";
import { hashPassword } from "../utils/password.js";
import { generateInviteToken } from "../utils/inviteToken.js";
import { sendInviteEmail } from "../utils/mailer.js";
import { isValidEmail } from "../utils/validators.js";
import { notify } from "../utils/notify.js";

const INVITE_EXPIRY_DAYS = Number(process.env.INVITE_EXPIRY_DAYS) || 3;

// ---------- TPO invites Additional TPO ----------
export async function inviteTPO(req, res, next) {
  const session = await mongoose.startSession();
  try {
    if (!req.profile.isPrimaryTPO) {
      return res.status(403).json({ message: "Only the Primary TPO can invite additional TPO accounts." });
    }

    const { email, name, phone, designation } = req.body;
    if (!email || !name) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Placeholder password — the invitee never sees or uses this; it's
    // overwritten the moment they activate via the emailed token. It only
    // exists because User.passwordHash is required at creation time.
    const placeholderPasswordHash = await hashPassword(generateInviteToken());
    const rawToken = generateInviteToken();
    const inviteTokenHash = await hashPassword(rawToken);
    const inviteTokenExpiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const userId = new mongoose.Types.ObjectId();
    const profileId = new mongoose.Types.ObjectId();

    session.startTransaction();

    await User.create(
      [
        {
          _id: userId,
          email: normalizedEmail,
          passwordHash: placeholderPasswordHash,
          role: "TPO",
          profileRef: profileId,
          profileModel: "TPO",
        },
      ],
      { session }
    );

    await TPO.create(
      [
        {
          _id: profileId,
          userId,
          workspaceId: req.workspaceId,
          name,
          phone,
          designation,
          isPrimaryTPO: false,
          invitedBy: req.profile._id,
          status: "invited",
          inviteTokenHash,
          inviteTokenExpiresAt,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await sendInviteEmail(normalizedEmail, "TPO", rawToken);

    return res.status(201).json({ message: "Invitation sent." });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(err);
  } finally {
    session.endSession();
  }
}

// ---------- TPO (any) or a company's Primary HR invites Additional HR ----------
export async function inviteHR(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { email, name, phone, designation, companyId } = req.body;
    if (!email || !name || !companyId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const isTPO = req.role === "TPO"; // TPO override authority — any TPO, any company
    const isPrimaryHRAtCompany =
      req.role === "HR" &&
      req.profile.isPrimaryHR &&
      req.profile.companyId.toString() === companyId;

    if (!isTPO && !isPrimaryHRAtCompany) {
      return res.status(403).json({
        message: "Only a TPO or the company's Primary HR can invite additional HR accounts.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const placeholderPasswordHash = await hashPassword(generateInviteToken());
    const rawToken = generateInviteToken();
    const inviteTokenHash = await hashPassword(rawToken);
    const inviteTokenExpiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const userId = new mongoose.Types.ObjectId();
    const profileId = new mongoose.Types.ObjectId();

    session.startTransaction();

    await User.create(
      [
        {
          _id: userId,
          email: normalizedEmail,
          passwordHash: placeholderPasswordHash,
          role: "HR",
          profileRef: profileId,
          profileModel: "HR",
        },
      ],
      { session }
    );

    await HR.create(
      [
        {
          _id: profileId,
          userId,
          companyId,
          name,
          phone,
          designation,
          isPrimaryHR: false,
          invitedBy: req.profile._id,
          invitedByModel: req.role, // "TPO" or "HR"
          status: "invited",
          inviteTokenHash,
          inviteTokenExpiresAt,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await sendInviteEmail(normalizedEmail, "HR", rawToken);

    return res.status(201).json({ message: "Invitation sent." });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(err);
  } finally {
    session.endSession();
  }
}

// ---------- TPO LISTS HoD REGISTRATION REQUESTS ----------
export async function listHoDRequests(req, res, next) {
  try {
    const filter = { workspaceId: req.workspaceId };
    filter.status = req.query.status || "pending";

    const hods = await HoD.find(filter).populate("userId", "email").sort({ createdAt: -1 });
    return res.status(200).json({ hods });
  } catch (err) {
    next(err);
  }
}

// ---------- TPO APPROVES/REJECTS A HoD REGISTRATION ----------
export async function respondToHoDRegistration(req, res, next) {
  try {
    const { hodId } = req.params;
    const { approve } = req.body;

    if (typeof approve !== "boolean") {
      return res.status(400).json({ message: '"approve" must be true or false.' });
    }

    const hod = await HoD.findOne({ _id: hodId, workspaceId: req.workspaceId });
    if (!hod) {
      return res.status(404).json({ message: "HoD registration not found." });
    }
    if (hod.status !== "pending") {
      return res.status(409).json({ message: `This registration has already been ${hod.status}.` });
    }

    hod.status = approve ? "approved" : "rejected";
    hod.approvedBy = req.profile._id;
    await hod.save();

    await notify(req.workspaceId, hod.userId, {
      type: approve ? "hod_registration_approved" : "hod_registration_rejected",
      title: approve ? "Your HoD registration was approved" : "Your HoD registration was rejected",
      message: approve
        ? "You can now log in and access your department dashboard."
        : "Contact your TPO if you believe this was a mistake.",
      relatedModel: "HoD",
      relatedId: hod._id,
    });

    return res.status(200).json({ hod });
  } catch (err) {
    next(err);
  }
}