// routes/tpo.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import requireRole from "../middleware/requireRole.js";
import uploadCsv from "../middleware/uploadCsv.js";
import { uploadRoster } from "../controller/roster.controller.js";
import { listHoDRequests, respondToHoDRegistration } from "../controller/team.controller.js";

const router = Router();

router.use(authenticate, resolveTenant, requireRole("TPO"));

// multipart/form-data: single CSV file under the field "roster".
router.post("/students/roster", uploadCsv.single("roster"), uploadRoster);

router.get("/hod-requests", listHoDRequests); // ?status=pending|approved|rejected (default: pending)
router.patch("/hod-requests/:hodId/respond", respondToHoDRegistration);

export default router;