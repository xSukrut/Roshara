import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

// create order (customer)
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice = 0,
      shippingPrice = 0,
      couponCode = null,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // compute itemsPrice
    let itemsPrice = 0;
    for (const item of orderItems) {
      const prod = await Product.findById(item.product);
      if (!prod) return res.status(400).json({ message: `Product ${item.product} not found` });

      itemsPrice += prod.price * item.quantity;
      item.name = prod.name;
      item.price = prod.price;
    }

    // apply coupon if provided
    let discountAmount = 0;
    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });

      if (!coupon) return res.status(400).json({ message: "Invalid or inactive coupon" });

      if (coupon.expiryDate && coupon.expiryDate < new Date()) {
        return res.status(400).json({ message: "Coupon expired" });
      }

      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }

      if (itemsPrice < coupon.minOrderAmount) {
        return res.status(400).json({ message: `Minimum order amount for coupon is ₹${coupon.minOrderAmount}` });
      }

      // calculate discount
      if (coupon.discountType === "percentage") {
        discountAmount = Math.round((itemsPrice * coupon.value) / 100);
      } else {
        discountAmount = coupon.value;
      }

      if (discountAmount > itemsPrice) discountAmount = itemsPrice;
    }

    const totalPrice = itemsPrice + Number(taxPrice) + Number(shippingPrice) - discountAmount;

    const order = new Order({
      user: req.user._id,
      orderItems,
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

    // increment coupon usedCount if coupon applied
    if (coupon) {
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      await coupon.save();
    }

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// get order by id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // allow owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// get logged-in user orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// update order status (admin)
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

// simulate marking order as paid (customer) — useful for testing
export const payOrderSimulated = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "paid") return res.status(400).json({ message: "Order already paid" });

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