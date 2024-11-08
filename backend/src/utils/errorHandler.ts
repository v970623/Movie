import { Response } from "express";

export const handleError = (
  res: Response,
  status: number,
  message: string,
  error?: any
) => {
  console.error(message, error);
  res.status(status).json({ status: "error", message, error });
};
