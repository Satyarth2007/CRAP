// models/JobPosting.js
// A recruitment drive posted by HR: role, department-level eligibility,
// dates, and TPO-configurable interview rounds.

import mongoose from "mongoose";
import tenantScope from "../plugins/tenantScope.js";

const { Schema } = mongoose;

const eligibilitySchema = new Schema(
  {
    departments: [{ type: String, trim: true, uppercase: true }],
    minCgpa: { type: Number, min: 0, max: 10 },
    maxBacklogs: { type: Number, min: 0 },
    passingYears: [{ type: Number }],
  },
  { _id: false }
);

const interviewRoundSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const jobPostingSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    role: { type: String, trim: true },
    ctc: { type: Number },

    // Eligibility is department-level, not college-wide.
    eligibility: { type: eligibilitySchema, required: true },

    // TPO-configurable per drive, not hardcoded.
    interviewRounds: { type: [interviewRoundSchema], default: [] },

    applicationDeadline: { type: Date },
    driveDate: { type: Date },

    status: {
      type: String,
      enum: ["draft", "open", "closed"],
      default: "draft",
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "HR", required: true },
  },
  { timestamps: true }
);

jobPostingSchema.plugin(tenantScope);

export default mongoose.model("JobPosting", jobPostingSchema);