// utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
const INVITE_EXPIRY_DAYS = Number(process.env.INVITE_EXPIRY_DAYS) || 3;

export async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Verify your email — SealNet HoD Registration",
    text: `Your verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
  });
}

// roleLabel: "TPO" or "HR". If FRONTEND_URL is set, sends a clickable
// activation link; otherwise falls back to a raw code the invitee can
// paste into an activation form.
export async function sendInviteEmail(to, roleLabel, token) {
  const activationPath = roleLabel === "TPO" ? "activate-tpo" : "activate-hr";
  const link = process.env.FRONTEND_URL
    ? `${process.env.FRONTEND_URL}/${activationPath}?email=${encodeURIComponent(to)}&token=${token}`
    : null;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `You've been invited as ${roleLabel} — SealNet`,
    text: link
      ? `You've been invited to join SealNet as ${roleLabel}. Activate your account: ${link} (expires in ${INVITE_EXPIRY_DAYS} days)`
      : `You've been invited to join SealNet as ${roleLabel}. Activation code: ${token} (expires in ${INVITE_EXPIRY_DAYS} days)`,
    html: link
      ? `<p>You've been invited to join SealNet as <strong>${roleLabel}</strong>.</p><p><a href="${link}">Activate your account</a></p><p>Expires in ${INVITE_EXPIRY_DAYS} days.</p>`
      : `<p>You've been invited to join SealNet as <strong>${roleLabel}</strong>.</p><p>Activation code: <strong>${token}</strong></p><p>Expires in ${INVITE_EXPIRY_DAYS} days.</p>`,
  });
}