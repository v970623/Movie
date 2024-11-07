import { Request, Response } from "express";

export const sendMessageToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Received message request:", req.body);
    const { content } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      console.error("User ID not found in request");
      res.status(401).json({ error: "User authentication failed" });
      return;
    }

    if (!content) {
      console.error("Missing content in request");
      res.status(400).json({ error: "Message content is required" });
      return;
    }

    console.log("Message sent successfully");
    res.status(200).json({
      status: "success",
      message: "Message sent to admin successfully",
    });
  } catch (error) {
    console.error("Error in sendMessageToAdmin:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send message to admin",
      error: error,
    });
  }
};
