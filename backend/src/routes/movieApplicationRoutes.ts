import express from "express";
import {
  submitApplication,
  getAllApplications,
  updateStatus,
} from "../controllers/movieApplicationController";
import { authenticate, isStaff } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/submit", authenticate, submitApplication);
router.get("/", authenticate, isStaff, getAllApplications);
router.patch("/:applicationId/status", authenticate, isStaff, updateStatus);

export default router;
