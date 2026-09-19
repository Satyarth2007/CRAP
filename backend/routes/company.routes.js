// routes/company.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import requireRole from "../middleware/requireRole.js";
import { createCompany, listCompanies, getCompanyById } from "../controller/company.controller.js";
import { connectCompany, requestConnection } from "../controller/connection.controller.js";

const router = Router();

router.use(authenticate, resolveTenant);

router.post("/", requireRole("TPO"), createCompany);
router.get("/", requireRole("TPO", "HR"), listCompanies);
router.get("/:companyId", requireRole("TPO", "HR"), getCompanyById);

router.post("/:companyId/connect", requireRole("TPO"), connectCompany);
router.post("/:companyId/request-connection", requireRole("HR"), requestConnection);

export default router;