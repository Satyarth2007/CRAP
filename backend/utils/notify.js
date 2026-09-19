// utils/notify.js
import Notification from "../models/Notification.js";

// Single-recipient notification. Fire-and-forget by design — a failed
// notification write should never fail the underlying business action
// (approving an HoD, issuing an offer, etc.), so callers should NOT await
// this inside a transaction; call it after the transaction commits.
export async function notify(workspaceId, userId, { type, title, message, relatedModel = null, relatedId = null }) {
  try {
    await Notification.create({ workspaceId, userId, type, title, message, relatedModel, relatedId });
  } catch (err) {
    console.error("[notify] failed to create notification:", err.message);
  }
}

// Bulk fan-out (e.g. notifying every eligible student when a drive opens).
// Uses insertMany for efficiency instead of looping individual creates.
export async function notifyMany(workspaceId, userIds, { type, title, message, relatedModel = null, relatedId = null }) {
  if (!userIds || userIds.length === 0) return;
  try {
    const docs = userIds.map((userId) => ({
      workspaceId,
      userId,
      type,
      title,
      message,
      relatedModel,
      relatedId,
    }));
    await Notification.insertMany(docs, { ordered: false });
  } catch (err) {
    console.error("[notify] bulk notification failed:", err.message);
  }
}