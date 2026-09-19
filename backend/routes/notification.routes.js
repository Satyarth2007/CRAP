// routes/notification.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import {
  listMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controller/notification.controller.js";

const router = Router();

router.use(authenticate, resolveTenant); // any authenticated role

router.get("/", listMyNotifications); // ?unreadOnly=true, HR also needs ?workspaceId=
router.patch("/:notificationId/read", markNotificationRead);
router.patch("/read-all", markAllNotificationsRead);

export default router;