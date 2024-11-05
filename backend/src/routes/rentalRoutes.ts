import express from "express";
import { authenticate, isStaff } from "../controllers/rentalController";
import {
  createRental,
  getRentals,
  getAllRentals,
  updateRentalStatus,
} from "../controllers/rentalController";

const router = express.Router();

router.post("/", authenticate, createRental);
router.get("/", authenticate, getRentals);
router.get("/all", authenticate, isStaff, getAllRentals);
router.put("/status", authenticate, isStaff, updateRentalStatus);

export default router;
