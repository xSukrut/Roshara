import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// admin
router.post("/", protect, admin, createCoupon);
router.get("/", protect, admin, getAllCoupons);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

// public apply (customer must be logged in)
router.post("/apply", protect, applyCoupon);

export default router;
