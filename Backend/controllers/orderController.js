import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

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

  // Normalize: accept product | _id | id + qty
  const orderItemsNorm = orderItems.map((it) => ({
    ...it,
    product: it.product || it._id || it.id,
    quantity: it.quantity || it.qty || 1,
  }));

  for (const [i, item] of orderItemsNorm.entries()) {
    if (!item?.product) {
      return res
        .status(400)
        .json({ message: `Missing product id for item #${i + 1}` });
    }
  }

  // Compute itemsPrice and backfill name/price from DB
  let itemsPrice = 0;
  for (const item of orderItemsNorm) {
    const prod = await Product.findById(item.product);
    if (!prod) {
      return res
        .status(400)
        .json({ message: `Product ${item.product} not found` });
    }
    itemsPrice += Number(prod.price) * (item.quantity || 1);
    item.name = prod.name;
    item.price = prod.price;
  }

  // Coupon (optional)
  let discountAmount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      active: true,
    });

    if (!coupon) return res.status(400).json({ message: "Invalid or inactive coupon" });
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

  const totalPrice =
    itemsPrice + Number(taxPrice) + Number(shippingPrice) - discountAmount;

  // Base order
  const order = new Order({
    user: req.user._id,
    orderItems: orderItemsNorm,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    itemsPrice,
    discountAmount,
    totalPrice,
    status: "pending",          // normalized main status
    paymentStatus: "pending",   // keep both in sync
    upi: {},                    // upi subdoc will be filled later if used
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

  if (!txnId) {
    return res.status(400).json({ message: "Transaction ID required" });
  }

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // only owner can submit proof
  if (order.user.toString() !== req.user._id.toString()) {
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
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  const isOwner = String(order.user?._id) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }
  res.json(order);
});


export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim().toLowerCase() || "";
  const status = req.query.status || "";

  const filter = {};
  if (status) {
    filter.$or = [{ paymentStatus: status }, { status }];
  }

  let orders = await Order.find(filter)
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  if (q) {
    orders = orders.filter((o) => {
      const id = String(o._id);
      const email = o.user?.email || "";
      const name = o.user?.name || "";
      return (
        id.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        name.toLowerCase().includes(q)
      );
    });
  }

  res.json(orders);
});


export const verifyOrderPayment = asyncHandler(async (req, res) => {
  const { action, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Mark paid/rejected
  order.paymentStatus = action === "paid" ? "paid" : "rejected";
  order.status = order.paymentStatus;

  if (action === "paid") {
    order.paidAt = new Date();
  }

  order.upi = order.upi || {};
  order.upi.verifiedBy = req.user?._id;
  order.upi.verifiedAt = new Date();
  if (note) order.adminNote = note;

  const updated = await order.save();
  res.json(updated);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  if (status === "paid") order.paidAt = new Date();

  const updated = await order.save();
  res.json(updated);
});


export const payOrderSimulated = asyncHandler(async (req, res) => {
  const { transactionId } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status === "paid")
    return res.status(400).json({ message: "Order already paid" });

  order.status = "paid";
  order.paymentStatus = "paid";
  order.paidAt = new Date();
  order.paymentResult = {
    id: transactionId || `MANUAL_${Date.now()}`,
    status: "success",
    update_time: new Date().toISOString(),
    email_address: req.user.email,
  };

  const updated = await order.save();
  res.json(updated);
});
