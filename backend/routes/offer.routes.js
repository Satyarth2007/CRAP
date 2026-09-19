// routes/offer.routes.js
import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import resolveTenant from "../middleware/resolveTenant.js";
import requireRole from "../middleware/requireRole.js";
import {
  createOffer,
  listMyOffers,
  respondToOffer,
  withdrawOffer,
  listOffersForJobPosting,
} from "../controller/offer.controller.js";

const router = Router();

router.use(authenticate, resolveTenant);

router.post("/", requireRole("HR"), createOffer);
router.patch("/:offerId/withdraw", requireRole("HR"), withdrawOffer);

router.get("/mine", requireRole("Student"), listMyOffers);
router.patch("/:offerId/respond", requireRole("Student"), respondToOffer);

router.get("/job-posting/:jobPostingId", requireRole("TPO", "HR"), listOffersForJobPosting);

export default router;