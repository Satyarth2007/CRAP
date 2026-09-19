// models/Application.js
// A student's application to a JobPosting, with stage-by-stage status.

import mongoose from "mongoose";
import tenantScope from "../plugins/tenantScope.js";

const { Schema } = mongoose;

const STATUSES = ["applied", "shortlisted", "interview", "selected", "rejected", "withdrawn"];

const stageHistoryEntrySchema = new Schema(
  {
    stage: { type: String, required: true },
    status: { type: String, enum: STATUSES, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const applicationSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    jobPostingId: { type: Schema.Types.ObjectId, ref: "JobPosting", required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },

    // Current interview round name — references JobPosting.interviewRounds.
    currentStage: { type: String, default: null },

    status: { type: String, enum: STATUSES, default: "applied" },
    stageHistory: { type: [stageHistoryEntrySchema], default: [] },

    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A student can only apply once per drive.
applicationSchema.index({ studentId: 1, jobPostingId: 1 }, { unique: true });

applicationSchema.plugin(tenantScope);

export default mongoose.model("Application", applicationSchema);