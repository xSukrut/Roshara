import express from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  payOrderSimulated,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// customer
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// simulate payment success (UPI “I’ve paid”)
router.post("/:id/pay-upi", protect, payOrderSimulated);
router.put("/:id/pay", protect, payOrderSimulated); // alias

// admin
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;
