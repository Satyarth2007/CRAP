// utils/otp.js
import crypto from "node:crypto";

const OTP_DIGITS = 6;

export function generateOtp() {
  const min = 10 ** (OTP_DIGITS - 1);
  const max = 10 ** OTP_DIGITS - 1;
  return crypto.randomInt(min, max + 1).toString();
}