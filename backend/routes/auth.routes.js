// routes/auth.routes.js
import { Router } from "express";
import {
  login,
  registerHoD,
  verifyHoDOtp,
  registerStudent,
  activateTPO,
  activateHR,
} from "../controller/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register/hod", registerHoD);
router.post("/register/hod/verify-otp", verifyHoDOtp);
router.post("/register/student", registerStudent);
router.post("/activate/tpo", activateTPO);
router.post("/activate/hr", activateHR);

export default router;