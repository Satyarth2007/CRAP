// routes/jobPosting.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import requireRole from "../middleware/requireRole.js";
import {
  createJobPosting,
  updateJobPosting,
  setInterviewRounds,
  openDrive,
  closeDrive,
  listJobPostings,
  getJobPostingById,
} from "../controller/jobPosting.controller.js";

const router = Router();

router.use(authenticate, resolveTenant);

router.post("/", requireRole("HR"), createJobPosting);
router.patch("/:jobPostingId", requireRole("HR"), updateJobPosting);

router.patch("/:jobPostingId/interview-rounds", requireRole("TPO"), setInterviewRounds);
router.patch("/:jobPostingId/open", requireRole("TPO"), openDrive);
router.patch("/:jobPostingId/close", requireRole("TPO"), closeDrive);

router.get("/", requireRole("TPO", "HR", "Student"), listJobPostings);
router.get("/:jobPostingId", requireRole("TPO", "HR", "Student"), getJobPostingById);

export default router;