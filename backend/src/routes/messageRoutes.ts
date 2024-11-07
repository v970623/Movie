import express from "express";
import { sendMessageToAdmin } from "../controllers/messageController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/send", authenticate, sendMessageToAdmin);

export default router;
