// controller/auth.controller.js
import mongoose from "mongoose";
import User from "../models/User.js";
import Student from "../models/Student.js";
import HoD from "../models/HoD.js";
import TPO from "../models/TPO.js";
import HR from "../models/HR.js";
import PendingHoDRegistration from "../models/PendingHoDRegistration.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { getWorkspace } from "../utils/workspace.js";
import { generateOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/mailer.js";
import { isValidEmail } from "../utils/validators.js";
import { notify, notifyMany } from "../utils/notify.js";

const MAX_OTP_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS) || 5;
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10;


// ---------- LOGIN (shared across all roles) ----------
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user._id);

    // Role/status gating (pending HoD, invited TPO/HR, etc.) is enforced
    // by resolveTenant on subsequent requests, not here — login only
    // verifies credentials. The client should be prepared to receive a
    // 403 from resolveTenant-guarded routes if the account isn't fully
    // active yet, and show the message resolveTenant returns.
    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// ---------- HoD SELF-REGISTRATION: STEP 1 — validate & send OTP ----------
export async function registerHoD(req, res, next) {
  try {
    const { email, password, name, phone, designation, departmentCode } = req.body;
    if (!email || !password || !name || !departmentCode) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const domain = normalizedEmail.split("@")[1];

    const workspace = await getWorkspace();
    const domainMatches =
      !!domain &&
      (domain === workspace.emailDomain || domain.endsWith("." + workspace.emailDomain));

    if (!domainMatches) {
      return res.status(400).json({
        message: `Registration requires an institutional email ending in @${workspace.emailDomain}.`,
      });
    }

    const normalizedDept = departmentCode.toUpperCase();
    const validDept = workspace.departments.some((d) => d.code === normalizedDept);
    if (!validDept) {
      return res.status(400).json({ message: "Unknown department code." });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await hashPassword(password);
    const otp = generateOtp();
    const otpHash = await hashPassword(otp); // reuse bcrypt hashing for the OTP too
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Upsert: resubmitting the form (e.g. "didn't get the email") just
    // issues a fresh OTP and resets the attempt counter, rather than
    // erroring on a duplicate pending registration.
    await PendingHoDRegistration.findOneAndUpdate(
      { workspaceId: workspace._id, email: normalizedEmail },
      {
        workspaceId: workspace._id,
        email: normalizedEmail,
        passwordHash,
        name,
        phone,
        designation,
        departmentCode: normalizedDept,
        otpHash,
        otpExpiresAt,
        attempts: 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({
      message: "A verification code has been sent to your email. Enter it to complete registration.",
    });
  } catch (err) {
    next(err);
  }
}

// ---------- HoD SELF-REGISTRATION: STEP 2 — verify OTP, create account ----------
export async function verifyHoDOtp(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const workspace = await getWorkspace();

    const pending = await PendingHoDRegistration.findOne({
      workspaceId: workspace._id,
      email: normalizedEmail,
    });

    if (!pending) {
      return res.status(400).json({
        message: "No pending registration found for this email. Please register again.",
      });
    }

    if (pending.otpExpiresAt < new Date()) {
      await PendingHoDRegistration.deleteOne({ _id: pending._id, workspaceId: workspace._id });
      return res.status(400).json({ message: "OTP has expired. Please register again." });
    }

    const validOtp = await comparePassword(otp, pending.otpHash);
    if (!validOtp) {
      pending.attempts += 1;
      if (pending.attempts >= MAX_OTP_ATTEMPTS) {
        await PendingHoDRegistration.deleteOne({ _id: pending._id, workspaceId: workspace._id });
        return res.status(400).json({ message: "Too many incorrect attempts. Please register again." });
      }
      await pending.save();
      return res.status(400).json({
        message: `Incorrect OTP. ${MAX_OTP_ATTEMPTS - pending.attempts} attempt(s) remaining.`,
      });
    }

    // OTP correct — create the real User + HoD documents atomically, and
    // remove the pending record in the same transaction. Pre-generate
    // both _ids so User.profileRef and HoD.userId can each point at the
    // other's document, since both schemas require the link.
    const userId = new mongoose.Types.ObjectId();
    const profileId = new mongoose.Types.ObjectId();

    session.startTransaction();

    await User.create(
      [
        {
          _id: userId,
          email: pending.email,
          passwordHash: pending.passwordHash,
          role: "HoD",
          profileRef: profileId,
          profileModel: "HoD",
        },
      ],
      { session }
    );

    await HoD.create(
      [
        {
          _id: profileId,
          userId,
          workspaceId: workspace._id,
          departmentCode: pending.departmentCode,
          name: pending.name,
          phone: pending.phone,
          designation: pending.designation,
          status: "pending", // email verified — still separately awaiting TPO approval
        },
      ],
      { session }
    );

    await PendingHoDRegistration.deleteOne(
      { _id: pending._id, workspaceId: workspace._id },
      { session }
    );

    await session.commitTransaction();

    // Notify every TPO in the workspace (Primary + Additional) — fired
    // AFTER commit, never inside the transaction, per utils/notify.js.
    const tpos = await TPO.find({ workspaceId: workspace._id, status: "active" }, { userId: 1 });
    await notifyMany(workspace._id, tpos.map((t) => t.userId), {
      type: "hod_registration_pending",
      title: "New HoD registration awaiting approval",
      message: `${pending.name} has registered as HoD for ${pending.departmentCode} and is awaiting your approval.`,
      relatedModel: "HoD",
      relatedId: profileId,
    });

    return res.status(201).json({
      message: "Email verified. Registration submitted — your account is awaiting TPO approval.",
    });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(err);
  } finally {
    session.endSession();
  }
}

// ---------- STUDENT SELF-REGISTRATION (claim flow) ----------
export async function registerStudent(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { rollNumber, name, email, password, phone } = req.body;
    if (!rollNumber || !name || !email || !password || !phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const normalizedRoll = rollNumber.trim().toUpperCase();
    const normalizedName = name.trim().toLowerCase();
    const workspace = await getWorkspace();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const shell = await Student.findOne({
      workspaceId: workspace._id,
      rollNumber: normalizedRoll,
      status: "unclaimed",
    });

    if (!shell) {
      return res.status(400).json({
        message:
          "No matching roll number found, or this roll number has already been registered. Contact your TPO if you believe this is an error.",
      });
    }

    // Name is checked against the TPO-uploaded roster record as a light
    // second factor — knowing a valid roll number alone shouldn't be
    // enough to claim someone else's account.
    if (shell.name.trim().toLowerCase() !== normalizedName) {
      return res.status(400).json({
        message: "The name you entered doesn't match our records for this roll number.",
      });
    }

    const passwordHash = await hashPassword(password);
    const userId = new mongoose.Types.ObjectId();

    session.startTransaction();

    await User.create(
      [
        {
          _id: userId,
          email: normalizedEmail,
          passwordHash,
          role: "Student",
          profileRef: shell._id,
          profileModel: "Student",
        },
      ],
      { session }
    );

    await Student.findOneAndUpdate(
      { _id: shell._id, workspaceId: workspace._id }, // tenantScope-compliant filter
      { userId, status: "registered", phone },
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({ message: "Registration complete. You can now log in." });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(err);
  } finally {
    session.endSession();
  }
}

// ---------- ACTIVATE INVITED TPO ACCOUNT ----------
export async function activateTPO(req, res, next) {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ message: "Email, token, and new password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, role: "TPO" });
    if (!user) {
      return res.status(400).json({ message: "Invalid activation link." });
    }

    const workspace = await getWorkspace();
    const tpo = await TPO.findOne({ _id: user.profileRef, workspaceId: workspace._id });
    if (!tpo || tpo.status !== "invited" || !tpo.inviteTokenHash) {
      return res.status(400).json({ message: "This invitation is no longer valid." });
    }

    if (tpo.inviteTokenExpiresAt < new Date()) {
      return res.status(400).json({ message: "This invitation has expired. Ask the Primary TPO to resend it." });
    }

    const validToken = await comparePassword(token, tpo.inviteTokenHash);
    if (!validToken) {
      return res.status(400).json({ message: "Invalid activation link." });
    }

    user.passwordHash = await hashPassword(password);
    await user.save();

    tpo.status = "active";
    tpo.inviteTokenHash = null;
    tpo.inviteTokenExpiresAt = null;
    await tpo.save();

    return res.status(200).json({ message: "Account activated. You can now log in." });
  } catch (err) {
    next(err);
  }
}

// ---------- ACTIVATE INVITED HR ACCOUNT ----------
export async function activateHR(req, res, next) {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) {
      return res.status(400).json({ message: "Email, token, and new password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, role: "HR" });
    if (!user) {
      return res.status(400).json({ message: "Invalid activation link." });
    }

    // HR isn't tenantScope-covered (scoped by companyId, not workspaceId),
    // so this is a plain findById rather than a workspace-filtered query.
    const hr = await HR.findById(user.profileRef);
    if (!hr || hr.status !== "invited" || !hr.inviteTokenHash) {
      return res.status(400).json({ message: "This invitation is no longer valid." });
    }

    if (hr.inviteTokenExpiresAt < new Date()) {
      return res.status(400).json({
        message: "This invitation has expired. Ask your TPO or Primary HR to resend it.",
      });
    }

    const validToken = await comparePassword(token, hr.inviteTokenHash);
    if (!validToken) {
      return res.status(400).json({ message: "Invalid activation link." });
    }

    user.passwordHash = await hashPassword(password);
    await user.save();

    hr.status = "active";
    hr.inviteTokenHash = null;
    hr.inviteTokenExpiresAt = null;
    await hr.save();

    return res.status(200).json({ message: "Account activated. You can now log in." });
  } catch (err) {
    next(err);
  }
}