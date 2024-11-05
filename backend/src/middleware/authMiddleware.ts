import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../types/user";
import { Document } from "mongoose";

const JWT_SECRET = "12345678";

interface IUserWithId extends IUser {
  id: string;
}

type JWTPayload = Pick<IUserWithId, "id" | "role">;

declare global {
  namespace Express {
    interface User extends IUserWithId {}
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
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded as IUserWithId;
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
  if ((req.user as IUserWithId)?.role === "staff") {
    next();
  } else {
    res.status(403).json({ error: "Staff access required" });
    return;
  }
};
