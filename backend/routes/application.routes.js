// routes/application.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import requireRole from "../middleware/requireRole.js";
import {
  createApplication,
  listMyApplications,
  withdrawApplication,
  listApplicationsForJobPosting,
  updateApplicationStage,
} from "../controller/application.controller.js";

const router = Router();

router.use(authenticate, resolveTenant);

router.post("/", requireRole("Student"), createApplication);
router.get("/mine", requireRole("Student"), listMyApplications);
router.patch("/:applicationId/withdraw", requireRole("Student"), withdrawApplication);

router.get("/job-posting/:jobPostingId", requireRole("TPO", "HR"), listApplicationsForJobPosting);
router.patch("/:applicationId/stage", requireRole("HR"), updateApplicationStage);

export default router;