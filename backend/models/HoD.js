// models/HoD.js
// Head of Department profile. HoD self-registers on the landing page using
// their institutional email (issued by the college, doubling as identity
// proof) and sits in "pending" status until the TPO approves.

import mongoose from "mongoose";
import tenantScope from "../plugins/tenantScope.js";

const { Schema } = mongoose;

const hodSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },

    departmentCode: { type: String, required: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    designation: { type: String, trim: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      // Set to "pending" at self-registration. Login is blocked (with a
      // distinct "awaiting TPO approval" response) until this is "approved".
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "TPO", default: null },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

hodSchema.plugin(tenantScope);

export default mongoose.model("HoD", hodSchema);