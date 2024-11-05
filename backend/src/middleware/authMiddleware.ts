import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../types/user";

const JWT_SECRET = "12345678";

type JWTPayload = Pick<IUser, "id" | "role">;

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as any;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const isStaff = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === "staff") {
    next();
  } else {
    res.status(403).json({ error: "Staff access required" });
    return;
  }
};
