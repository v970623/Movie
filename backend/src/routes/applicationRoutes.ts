import { Router } from "express";
import {
  submitApplication,
  updateApplicationStatus,
  getApplications,
  searchApplications,
  uploadAttachment,
} from "../controllers/applicationController";
import { authenticate } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.post("/submit", authenticate, async (req, res) => {
  await submitApplication(req, res);
});

router.put("/update", authenticate, async (req, res) => {
  await updateApplicationStatus(req, res);
});

router.get("/list", authenticate, async (req, res) => {
  await getApplications(req, res);
});

router.get("/search", authenticate, async (req, res) => {
  await searchApplications(req, res);
});

router.post(
  "/:applicationId/upload",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    await uploadAttachment(req, res);
  }
);

export default router;
