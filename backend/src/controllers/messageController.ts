import { Request, Response } from "express";
import { sendEmailNotification } from "../services/emailService";
import User from "../models/userModel";

export const sendMessageToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, message } = req.body;

    await sendEmailNotification("user_message", {
      userId,
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Message sent to admin successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to send message to admin",
      error: error,
    });
  }
};

export const replyToUserMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, replyMessage } = req.body;

    if (!userId || !replyMessage) {
      res.status(400).json({ error: "UserId and replyMessage are required" });
      return;
    }

    const user = await User.findById(userId);
    if (!user || !user.email) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await sendEmailNotification("admin_reply", {
      userId,
      message: replyMessage,
    });

    res.status(200).json({
      status: "success",
      message: "Reply sent to user successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to send reply to user",
      error: error,
    });
  }
};
