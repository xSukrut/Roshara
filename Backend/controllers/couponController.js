// controllers/couponController.js
import Coupon from "../models/Coupon.js";

// Create a new coupon (Admin)
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, value, minOrderAmount, expiryDate, usageLimit } = req.body;

    const exists = await Coupon.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = await Coupon.create({
      code,
      discountType,
      value,
      minOrderAmount,
      expiryDate,
      usageLimit,
    });

    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all coupons (Admin)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single coupon by ID (Admin)
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update coupon (Admin)
export const updateCoupon = async (req, res) => {
  try {
    const { code, discountType, value, minOrderAmount, expiryDate, usageLimit, active } = req.body;
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    coupon.code = code || coupon.code;
    coupon.discountType = discountType || coupon.discountType;
    coupon.value = value || coupon.value;
    coupon.minOrderAmount = minOrderAmount || coupon.minOrderAmount;
    coupon.expiryDate = expiryDate || coupon.expiryDate;
    coupon.usageLimit = usageLimit ?? coupon.usageLimit;
    coupon.active = active ?? coupon.active;

    const updated = await coupon.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete coupon (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    await coupon.deleteOne();
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Validate coupon (Customer)
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(400).json({ message: "Invalid or inactive coupon" });

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}`,
      });
    }

    res.json({
      valid: true,
      discountType: coupon.discountType,
      value: coupon.value,
      message: "Coupon applied successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(400).json({ message: "Invalid or inactive coupon" });

    if (coupon.expiryDate && new Date() > coupon.expiryDate) return res.status(400).json({ message: "Coupon expired" });

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: "Coupon usage limit reached" });

    if (totalAmount < coupon.minOrderAmount) return res.status(400).json({ message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` });

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((totalAmount * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }

    // Ensure discount doesn't exceed total
    if (discount > totalAmount) discount = totalAmount;

    const newTotal = totalAmount - discount;

    // increment usedCount
    coupon.usedCount = (coupon.usedCount || 0) + 1;
    await coupon.save();

    res.status(200).json({ message: "Coupon applied successfully", discount, newTotal });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
