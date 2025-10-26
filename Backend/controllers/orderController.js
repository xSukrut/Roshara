import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

export const createOrder = async (req, res) => {
  try {
    console.log("➡️  /api/orders payload:", JSON.stringify(req.body));

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

    // Validate each has a product id
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
      itemsPrice += prod.price * (item.quantity || 1);
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

    const totalPrice =
      itemsPrice + Number(taxPrice) + Number(shippingPrice) - discountAmount;

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
      status: "pending",
    });

    const created = await order.save();

    if (coupon) {
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      await coupon.save();
    }

    res.status(201).json(created);
  } catch (err) {
    console.error("Order create error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    // owner or admin only
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "paid") order.paidAt = Date.now();
    if (status === "shipped") order.shippedAt = Date.now();

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Simulate marking order as paid for UPI/manual confirmation
export const payOrderSimulated = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "paid")
      return res.status(400).json({ message: "Order already paid" });

    order.status = "paid";
    order.paidAt = Date.now();
    order.paymentResult = {
      id: transactionId || `MANUAL_${Date.now()}`,
      status: "success",
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
