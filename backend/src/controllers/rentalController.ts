import { Request, Response } from "express";
import Rental from "../models/rentalModel";
import Movie from "../models/movieModel";

export const createRental = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { movieId, startDate, endDate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const movie = await Movie.findById(movieId);
    if (!movie || movie.status === "unavailable") {
      res.status(400).json({ error: "Movie is not available" });
      return;
    }

    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 3600 * 24)
    );
    const totalPrice = days * movie.price;

    const rental = await Rental.create({
      userId,
      movieId,
      startDate,
      endDate,
      totalPrice,
      status: "new",
    });

    res.status(201).json({
      status: "success",
      data: rental,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to create rental",
    });
  }
};

export const getRentals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rentals = await Rental.find({ userId: req.user?.id })
      .populate("movieId")
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: rentals,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to get rentals",
    });
  }
};

export const getRentalHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const rentals = await Rental.find({ userId })
      .populate("movieId")
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: rentals,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to get rental history",
    });
  }
};

export const getAllRentals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rentals = await Rental.find()
      .populate("movieId")
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: rentals,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to get all rentals",
    });
  }
};

export const updateRentalStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rentalId, status } = req.body;
    const rental = await Rental.findById(rentalId)
      .populate("userId")
      .populate("movieId");

    if (!rental) {
      res.status(404).json({ error: "Rental not found" });
      return;
    }

    rental.status = status;
    await rental.save();

    res.json({
      status: "success",
      data: rental,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to update rental status",
    });
  }
};
