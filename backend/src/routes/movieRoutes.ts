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
  saveSelectedMovies,
} from "../controllers/movieController";
import { isStaff } from "../middleware/authMiddleware";
const router = express.Router();

// Admin only routes

router.get("/search", authenticate, isStaff, searchMovies);

// Public routes (require authentication)
router.get("/", authenticate, getMovies);
router.get("/:id", authenticate, getMovieById);

router.post("/save-selected", authenticate, isStaff, saveSelectedMovies);
router.post("/", authenticate, isStaff, createMovie);
router.put("/:id", authenticate, isStaff, updateMovie);
router.delete("/:id", authenticate, isStaff, deleteMovie);

router.put("/:id/availability", authenticate, isStaff, updateMovieAvailability);

export default router;
