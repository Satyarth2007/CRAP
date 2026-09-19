// routes/team.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import requireRole from "../middleware/requireRole.js";
import { inviteTPO, inviteHR } from "../controller/team.controller.js";

const router = Router();

router.use(authenticate, resolveTenant);

router.post("/tpo/invite", requireRole("TPO"), inviteTPO); // isPrimaryTPO check happens in the controller
router.post("/hr/invite", requireRole("TPO", "HR"), inviteHR); // isPrimaryHR (for HR) checked in the controller

export default router;