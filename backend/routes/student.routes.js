// routes/student.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import requireRole from "../middleware/requireRole.js";
import upload from "../middleware/upload.js";
import { addSemesterResults, addDocuments, getMyProfile, updateSocialLinks } from "../controller/student.controller.js";

const router = Router();

// Every route here requires a logged-in, active Student account.
router.use(authenticate, resolveTenant, requireRole("Student"));

router.get("/profile", getMyProfile);
router.patch("/profile/links", updateSocialLinks);

// multipart/form-data: "semesters" text field (JSON array of semester
// numbers) + up to 8 images under the field name "semesterResults", same
// pairing convention used elsewhere — semesters[i] describes files[i].
router.post("/profile/semester-results", upload.array("semesterResults", 8), addSemesterResults);

// multipart/form-data: "labels" text field (JSON array of strings, e.g.
// ["resume","idProof"]) + up to 8 images under the field name "documents",
// paired by index. A label of "resume" also updates Student.resumeUrl.
router.post("/profile/documents", upload.array("documents", 8), addDocuments);

export default router;