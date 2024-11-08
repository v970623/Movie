import { Request, Response } from "express";
import { handleError } from "../utils/errorHandler";

export const sendMessageToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { content } = req.body;
    const userId = (req.user as any)?.id;

    if (!userId || !content) {
      const errorMessage = !userId
        ? "User authentication failed"
        : "Message content is required";
      handleError(res, !userId ? 401 : 400, errorMessage);
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Message sent to admin successfully",
    });
  } catch (error) {
    handleError(res, 500, "Failed to send message to admin", error);
  }
};
