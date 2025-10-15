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
    // verify product IDs and compute current price
    for (const item of orderItems) {
      const prod = await Product.findById(item.product);
      if (!prod) return res.status(400).json({ message: `Product ${item.product} not found` });
      itemsPrice += (prod.price * item.quantity);
      // normalize item name & price
      item.name = prod.name;
      item.price = prod.price;
    }

    // apply coupon if provided (validate)
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (!coupon) return res.status(400).json({ message: "Invalid coupon code" });

      if (coupon.expiryDate && coupon.expiryDate < new Date()) {
        return res.status(400).json({ message: "Coupon expired" });
      }
      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit exceeded" });
      }
      if (itemsPrice < coupon.minOrderAmount) {
        return res.status(400).json({ message: `Minimum order amount for coupon is ${coupon.minOrderAmount}` });
      }

      if (coupon.discountType === "percentage") {
        discountAmount = Math.round((itemsPrice * coupon.value) / 100);
      } else {
        discountAmount = coupon.value;
      }

      // don't allow discount > itemsPrice
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
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "paid") return res.status(400).json({ message: "Order already paid" });

    order.status = "paid";
    order.paidAt = Date.now();
    order.paymentResult = {
      id: `TEST_${Date.now()}`,
      status: "success",
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    // if coupon was used, increment usedCount now
    // find coupon code from request body (optional)
    const { couponCode } = req.body;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
