// routes/connection.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import requireRole from "../middleware/requireRole.js";
import { listConnections, respondToConnection } from "../controller/connection.controller.js";

const router = Router();

router.use(authenticate, resolveTenant);

router.get("/", requireRole("TPO", "HR"), listConnections);
router.patch("/:connectionId/respond", requireRole("TPO"), respondToConnection);

export default router;