// models/HR.js
// Company-side recruiter profile. Provisioned by the TPO — not self-serve.
// isPrimaryHR gates invite/remove-team-member actions only; all other
// capabilities are identical between Primary and Additional HR.

import mongoose from "mongoose";

const { Schema } = mongoose;

const hrSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },

    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    designation: { type: String, trim: true },

    isPrimaryHR: { type: Boolean, required: true, default: false },

    // TPO for the first HR at a company; a Primary HR's _id for
    // subsequently invited Additional HR.
    invitedBy: { type: Schema.Types.ObjectId, refPath: "invitedByModel" },
    invitedByModel: { type: String, enum: ["TPO", "HR"] },

    inviteTokenHash: { type: String, default: null },
    inviteTokenExpiresAt: { type: Date, default: null },

    status: {
      type: String,
      enum: ["invited", "active"],
      default: "invited",
    },
  },
  { timestamps: true }
);

export default mongoose.model("HR", hrSchema);