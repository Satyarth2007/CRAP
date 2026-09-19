// models/Connection.js
// Company <-> Workspace relationship and approval state.

import mongoose from "mongoose";
import tenantScope from "../plugins/tenantScope.js";

const { Schema } = mongoose;

const connectionSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    requestedBy: { type: Schema.Types.ObjectId, refPath: "requestedByModel" },
    requestedByModel: { type: String, enum: ["TPO", "HR"] },
    approvedBy: { type: Schema.Types.ObjectId, ref: "TPO", default: null },

    requestedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

connectionSchema.index({ companyId: 1, workspaceId: 1 }, { unique: true });

connectionSchema.plugin(tenantScope);

export default mongoose.model("Connection", connectionSchema);