import express from "express";
import {
  createOrder,
  submitUpiProof,
  getOrderById,
  getMyOrders,
  getAllOrdersAdmin,
  verifyOrderPayment,
  updateOrderStatus,
  payOrderSimulated, // optional
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// customer
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// customer submits UPI proof (txn id)
router.post("/:id/upi-proof", protect, submitUpiProof);

// admin
router.get("/", protect, admin, getAllOrdersAdmin);
router.put("/:id/verify", protect, admin, verifyOrderPayment);
router.put("/:id/status", protect, admin, updateOrderStatus);

// dev/test
router.put("/:id/pay-simulated", protect, admin, payOrderSimulated);

export default router;
