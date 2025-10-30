// controllers/orderController.js
import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import User from "../models/userModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice = 0,
    shippingPrice = 0,
    couponCode = null,
  } = req.body;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  // normalize product id & qty
  const items = orderItems.map((it) => ({
    ...it,
    product: it.product || it._id || it.id,
    quantity: it.quantity || it.qty || 1,
  }));

  for (let i = 0; i < items.length; i++) {
    if (!items[i].product) {
      return res
        .status(400)
        .json({ message: `Missing product id for item #${i + 1}` });
    }
  }

  // compute items price and hydrate name/price
  let itemsPrice = 0;
  for (const it of items) {
    const prod = await Product.findById(it.product);
    if (!prod) {
      return res
        .status(400)
        .json({ message: `Product ${it.product} not found` });
    }
    itemsPrice += Number(prod.price) * Number(it.quantity || 1);
    it.name = prod.name;
    it.price = prod.price;
  }

  // coupon (optional)
  let discountAmount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid or inactive coupon" });
    }
    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }
    if (itemsPrice < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount for coupon is ₹${coupon.minOrderAmount}`,
      });
    }

    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((itemsPrice * coupon.value) / 100);
    } else {
      discountAmount = coupon.value;
    }
    if (discountAmount > itemsPrice) discountAmount = itemsPrice;
  }

  const totalPrice = itemsPrice + Number(shippingPrice) - discountAmount;

  const order = new Order({
    user: req.user._id,
    orderItems: items,
    shippingAddress,
    paymentMethod,
    taxPrice,        
    shippingPrice,
    itemsPrice,
    discountAmount,
    totalPrice,
    status: "pending",
    paymentStatus: "pending",
    upi: {},
  });

  const created = await order.save();

  if (coupon) {
    coupon.usedCount = (coupon.usedCount || 0) + 1;
    await coupon.save();
  }

  res.status(201).json(created);
});

export const submitUpiProof = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const txnId = (req.body?.transactionId || req.body?.txnId || "").toString().trim();

  if (!txnId) return res.status(400).json({ message: "Transaction ID required" });

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (String(order.user) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  order.upi = order.upi || {};
  order.upi.txnId = txnId;
  order.upi.submittedAt = new Date();

  order.paymentStatus = "pending_verification";
  order.status = "pending_verification";

  const updated = await order.save();
  res.json(updated);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) return res.status(404).json({ message: "Order not found" });

  const isOwner = String(order.user?._id) === String(req.user._id);
  const isAdmin = req.user.role === "admin" || req.user.isAdmin;
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not authorized to view this order" });
  }
  res.json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const adminListOrders = asyncHandler(async (req, res) => {
  if (!req.user || !(req.user.isAdmin || req.user.role === "admin")) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { q = "", status = "" } = req.query;

  const filter = {};
  if (status) {
    filter.$or = [{ paymentStatus: status }, { status }];
  }

  let userIds = [];
  if (q) {
    const users = await User.find({
      $or: [
        { email: { $regex: q, $options: "i" } },
        { name:  { $regex: q, $options: "i" } },
      ],
    }).select("_id");
    userIds = users.map((u) => u._id);
  }

  const idOr = [];
  if (q) {
    idOr.push({ _id: q });
    idOr.push({ _id: { $regex: q, $options: "i" } });
    if (userIds.length) idOr.push({ user: { $in: userIds } });
    filter.$or = filter.$or ? [...filter.$or, ...idOr] : idOr;
  }

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "paid" | "rejected" | "pending_verification"

    const allowed = ["pending_verification", "paid", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.paymentStatus = status;

    if (status === "paid") {
      order.paid = true;
      order.paidAt = new Date();
    } else {
      order.paid = false;
      order.paidAt = null;
    }

    const saved = await order.save();
    res.json(saved);
  } catch (e) {
    console.error("updateOrderStatus error:", e);
    res.status(500).json({ message: "Server error updating order" });
  }
};
