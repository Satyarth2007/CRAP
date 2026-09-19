// routes/hod.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import requireRole from "../middleware/requireRole.js";
import {
  listDepartmentStudents,
  listDepartmentApplications,
  getDepartmentStats,
} from "../controller/hod.controller.js";

const router = Router();

router.use(authenticate, resolveTenant, requireRole("HoD"));

router.get("/students", listDepartmentStudents); // ?status=&isPlaced=
router.get("/applications", listDepartmentApplications); // ?status=&jobPostingId=
router.get("/stats", getDepartmentStats);

export default router;