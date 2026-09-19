// models/Notification.js
// In-app notifications only (FR-SYS-1–13 scope — no WhatsApp/SMS/email
// digest for v1). Not one of the 11 confirmed schemas — added to support
// this feature, following the same tenantScope pattern as everything else.

import mongoose from "mongoose";
import tenantScope from "../plugins/tenantScope.js";

const { Schema } = mongoose;

const NOTIFICATION_TYPES = [
  "hod_registration_pending",
  "hod_registration_approved",
  "hod_registration_rejected",
  "connection_requested",
  "connection_approved",
  "connection_rejected",
  "drive_opened",
  "application_status_change",
  "offer_issued",
  "offer_accepted",
  "team_invite",
];

const notificationSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    // Optional pointer back to whatever this notification is about, so a
    // client can deep-link ("View Application" -> /applications/:id).
    relatedModel: {
      type: String,
      enum: ["Application", "Offer", "HoD", "Connection", "JobPosting"],
      default: null,
    },
    relatedId: { type: Schema.Types.ObjectId, default: null },

    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ workspaceId: 1, userId: 1, isRead: 1, createdAt: -1 });

notificationSchema.plugin(tenantScope);

export default mongoose.model("Notification", notificationSchema);