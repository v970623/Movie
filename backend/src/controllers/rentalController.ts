import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../types/user";
import { Document } from "mongoose";
import Rental from "../models/rentalModel";
import Movie from "../models/movieModel";
import { sendEmailNotification } from "../services/emailService";

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
    req.user = decoded;
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
  if ((req.user as IUserWithId).role === "staff") {
    next();
  } else {
    res.status(403).json({ error: "Staff permission required" });
    return;
  }
};

export const createRental = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const rentalDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const totalPrice = rentalDays * movie.price;

    const rental = await Rental.create({
      userId: (req.user as IUserWithId).id,
      movieId: req.body.movieId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      totalPrice,
      status: "new",
    });

    await sendEmailNotification("rental_confirmation", {
      userId: (req.user as IUserWithId).id,
      movieTitle: movie?.title,
      startDate: rental.startDate,
      endDate: rental.endDate,
      totalPrice: rental.totalPrice,
    });

    res.status(201).json({
      status: "success",
      data: rental,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to create rental record",
      error: error,
    });
  }
};

export const getRentals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rentals = await Rental.find({
      userId: (req.user as IUserWithId).id,
    })
      .populate("movieId")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      data: rentals,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to get rental records",
      error: error,
    });
  }
};

export const getAllRentals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rentals = await Rental.find()
      .populate("userId")
      .populate("movieId")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      data: rentals,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to get all rental records",
      error: error,
    });
  }
};

export const updateRentalStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.body.rentalId,
      { status: req.body.status },
      { new: true }
    );

    if (!rental) {
      res.status(404).json({
        status: "error",
        message: "Rental record not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: rental,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to update rental status",
      error: error,
    });
  }
};
