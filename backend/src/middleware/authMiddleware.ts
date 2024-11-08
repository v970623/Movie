import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../types/user";
import { handleError } from "../utils/errorHandler";

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
    handleError(res, 401, "Access denied");
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded as IUserWithId;
    next();
  } catch (error) {
    handleError(res, 401, "Invalid token", error);
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
    handleError(res, 403, "Staff access required");
    return;
  }
};
