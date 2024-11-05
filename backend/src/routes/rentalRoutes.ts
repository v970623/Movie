import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createRental, getRentals } from "../controllers/rentalController";

const router = express.Router();

router.post("/", authenticate, createRental);
router.get("/", authenticate, getRentals);

export default router;
