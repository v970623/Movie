import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { sendMessage, getMessages } from "../controllers/messageController";

const router = express.Router();

// 发送消息
router.post("/", authenticate, sendMessage);

// 获取与某个申请相关的所有消息
router.get("/application/:applicationId", authenticate, getMessages);

export default router;
