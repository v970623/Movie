import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Rental from "../models/rentalModel";
import Movie from "../models/movieModel";
import { sendEmailNotification } from "../services/emailService";
import { handleError } from "../utils/errorHandler";
const JWT_SECRET: string = process.env.JWT_SECRET;

declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;
    }
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
    req.user = jwt.verify(token, JWT_SECRET) as unknown as Express.User;
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
  if (req.user?.role === "staff") {
    next();
  } else {
    res.status(403).json({ error: "Staff permission required" });
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

    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      res.status(400).json({ error: "End date must not be before start date" });
      return;
    }

    const rentalDays = Math.max(
      1,
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );
    const totalPrice = rentalDays * movie.price;

    const rental = await Rental.create({
      userId: req.user.id,
      movieId: req.body.movieId,
      startDate,
      endDate,
      totalPrice,
      status: "new",
    });

    await sendEmailNotification("rental_confirmation", {
      userId: req.user.id,
      movieTitle: movie.title,
      startDate: rental.startDate,
      endDate: rental.endDate,
      totalPrice: rental.totalPrice,
    });

    res.status(201).json({ status: "success", data: rental });
  } catch (error) {
    handleError(res, 400, "Failed to create rental record", error);
  }
};

export const getRentals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rentals = await Rental.find({ userId: req.user.id })
      .populate("movieId")
      .populate("userId")
      .sort("-createdAt");

    res
      .status(200)
      .json({ status: "success", data: rentals.filter((r) => r.movieId) });
  } catch (error) {
    handleError(res, 400, "Failed to get rental records", error);
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
    res.status(200).json({ status: "success", data: rentals });
  } catch (error) {
    handleError(res, 400, "Failed to get all rental records", error);
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
    if (rental) {
      res.status(200).json({ status: "success", data: rental });
    } else {
      res.status(404).json({ error: "Rental record not found" });
    }
  } catch (error) {
    handleError(res, 400, "Failed to update rental status", error);
  }
};
