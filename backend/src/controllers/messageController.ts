import { Request, Response } from "express";
import { Message } from "../models/messageModel";
import Application from "../models/applicationModel";
import User from "../models/userModel";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
    role: string;
  };
}

// Send message
export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { applicationId, content } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      res.status(404).json({ error: "Application not found" });
    }

    const message = new Message({
      from: req.user.id,
      to: req.user.role === "public" ? "staff" : application?.userId,
      applicationId,
      content,
    });

    await message.save();
    await message.populate("from", "username");

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get messages
export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { applicationId } = req.params;

    // Get all messages related to the application
    const messages = await Message.find({ applicationId })
      .populate("from", "username")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to get messages" });
  }
};
