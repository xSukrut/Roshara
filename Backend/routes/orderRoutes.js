import express from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  payOrderSimulated
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);            // create order (customer)
router.get("/myorders", protect, getMyOrders);     // get logged-in user's orders
router.get("/:id", protect, getOrderById);         // get single order
router.put("/:id/pay", protect, payOrderSimulated);// simulate payment (customer)
router.get("/", protect, admin, getAllOrders);// admin: list all orders
router.put("/:id/status", protect, admin, updateOrderStatus);// admin: update status

export default router;

