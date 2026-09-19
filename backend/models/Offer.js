// models/Offer.js
// Offer record. The one-offer rule is enforced at the DATABASE level via a
// unique partial index — not application-level logic — so it holds even
// under race conditions / concurrent requests.
//
// Accepting an offer should trigger auto-withdrawal of the student's other
// pending Applications (handled in the service layer, not here).

import mongoose from "mongoose";
import tenantScope from "../plugins/tenantScope.js";

const { Schema } = mongoose;

const offerSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    applicationId: { type: Schema.Types.ObjectId, ref: "Application", required: true },
    jobPostingId: { type: Schema.Types.ObjectId, ref: "JobPosting", required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },

    ctc: { type: Number },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "withdrawn"],
      default: "pending",
    },

    issuedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// One-offer rule: a student can have at most ONE offer with status "accepted",
// enforced by MongoDB itself via a unique partial index.
offerSchema.index(
  { studentId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "accepted" },
  }
);

offerSchema.plugin(tenantScope);

export default mongoose.model("Offer", offerSchema);