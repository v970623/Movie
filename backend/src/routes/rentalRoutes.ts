import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { isStaff } from "../middleware/authMiddleware";
import {
  createRental,
  getRentals,
  getAllRentals,
  updateRentalStatus,
} from "../controllers/rentalController";

const router = express.Router();

router.post("/", authenticate, createRental);
router.get("/", authenticate, getRentals);
router.get("/admin", authenticate, isStaff, getAllRentals);
router.put("/status", authenticate, isStaff, updateRentalStatus);

export default router;
