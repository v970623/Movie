import express from "express";
import {
  sendMessageToAdmin,
  replyToUserMessage,
} from "../controllers/messageController";
import { authenticate, isStaff } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/send", authenticate, sendMessageToAdmin);
router.post("/reply", authenticate, isStaff, replyToUserMessage);

export default router;
