import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  getMovies,
  getMovieById,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  updateMovieAvailability,
} from "../controllers/movieController";
import { isStaff } from "../middleware/authMiddleware";
const router = express.Router();

// Public routes (require authentication)
router.get("/", authenticate, getMovies);
router.get("/search", authenticate, searchMovies);
router.get("/:id", authenticate, getMovieById);

// Admin only routes
router.post("/", authenticate, isStaff, createMovie);
router.put("/:id", authenticate, isStaff, updateMovie);
router.delete("/:id", authenticate, isStaff, deleteMovie);
router.put("/:id/availability", authenticate, isStaff, updateMovieAvailability);

export default router;
