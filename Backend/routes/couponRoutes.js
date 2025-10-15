import express from "express";
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin Routes
router.route("/")
  .post(protect, admin, createCoupon) // create coupon
  .get(protect, admin, getCoupons);  // list all coupons

router.route("/:id")
  .get(protect, admin, getCouponById)  // get single coupon
  .put(protect, admin, updateCoupon)   // update coupon
  .delete(protect, admin, deleteCoupon); // delete coupon

// ✅ Customer Routes
router.post("/validate", protect, validateCoupon); // check coupon validity
router.post("/apply", protect, applyCoupon);       // apply coupon to order/cart

export default router;


