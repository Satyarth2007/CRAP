// models/Workspace.js
// Represents the single college tenant. Seeded at deployment time by the
// dev team — departments and emailDomain are required before HoD/Student
// registration can function.

import mongoose from "mongoose";

const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
  },
  { _id: false }
);

const workspaceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },

    // Institutional email domain (e.g. "xyzcollege.edu.in") — used to
    // verify HoD registration emails belong to this college.
    emailDomain: { type: String, required: true, trim: true, lowercase: true },

    // Required at seed time — powers the department dropdown on Student
    // and HoD registration, and department-level eligibility on JobPosting.
    departments: {
      type: [departmentSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Workspace must be seeded with at least one department.",
      },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Workspace", workspaceSchema);