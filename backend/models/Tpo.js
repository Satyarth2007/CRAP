// models/TPO.js
// Training & Placement Officer profile.
//
// Primary TPO: seeded directly into the DB at deployment time for the
// college — no in-app registration path exists.
// Additional TPO: invited by the Primary TPO from inside the workspace
// (invite-and-activate flow details are an open decision).
//
// isPrimaryTPO gates invite/remove-team-member actions ONLY — every other
// capability (HoD approval, HR provisioning, drive management, etc.) is
// identical between Primary and Additional TPO accounts.

import mongoose from "mongoose";
import tenantScope from "../plugins/tenantScope.js";

const { Schema } = mongoose;

const tpoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },

    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    designation: { type: String, trim: true },

    isPrimaryTPO: { type: Boolean, required: true, default: false },

    // null for the seeded Primary TPO; set to the inviting TPO's _id
    // for Additional TPO accounts.
    invitedBy: { type: Schema.Types.ObjectId, ref: "TPO", default: null },

    inviteTokenHash: { type: String, default: null },
    inviteTokenExpiresAt: { type: Date, default: null },

    status: {
      type: String,
      enum: ["active", "invited"],
      default: "active",
      // Primary TPO is created as "active" at seed time.
      // Additional TPO starts "invited" until the invite flow completes.
    },
  },
  { timestamps: true }
);

tpoSchema.plugin(tenantScope);

export default mongoose.model("TPO", tpoSchema);