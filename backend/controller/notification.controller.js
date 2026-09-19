// controller/notification.controller.js
import Notification from "../models/Notification.js";
import { getScopedWorkspaceId } from "../utils/scopeHelpers.js";

// ---------- LIST MY NOTIFICATIONS ----------
export async function listMyNotifications(req, res, next) {
  try {
    const workspaceId = getScopedWorkspaceId(req); // HR must pass ?workspaceId=
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    const filter = { workspaceId, userId: req.user._id };
    if (req.query.unreadOnly === "true") {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(100);
    const unreadCount = await Notification.countDocuments({ ...filter, isRead: false });

    return res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
}

// ---------- MARK ONE AS READ ----------
export async function markNotificationRead(req, res, next) {
  try {
    const { notificationId } = req.params;
    const workspaceId = getScopedWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, workspaceId, userId: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    return res.status(200).json({ notification });
  } catch (err) {
    next(err);
  }
}

// ---------- MARK ALL AS READ ----------
export async function markAllNotificationsRead(req, res, next) {
  try {
    const workspaceId = getScopedWorkspaceId(req);
    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    await Notification.updateMany(
      { workspaceId, userId: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return res.status(200).json({ message: "All notifications marked as read." });
  } catch (err) {
    next(err);
  }
}