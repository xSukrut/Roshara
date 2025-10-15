import Coupon from "../models/Coupon.js";

// create coupon (admin)
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, value, minOrderAmount = 0, usageLimit = 0, expiryDate = null } = req.body;
    // upper-case code
    const upper = code.toUpperCase();
    const existing = await Coupon.findOne({ code: upper });
    if (existing) return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = await Coupon.create({
      code: upper,
      discountType,
      value,
      minOrderAmount,
      usageLimit,
      expiryDate,
      active: true,
    });

    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// get all coupons (admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// update coupon (admin)
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    Object.assign(coupon, req.body);
    coupon.code = coupon.code.toUpperCase();
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// delete coupon (admin)
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// apply coupon (customer) -> returns discount amount and new totals (doesn't change DB)
export const applyCoupon = async (req, res) => {
  try {
    const { code, itemsPrice } = req.body;
    if (!code) return res.status(400).json({ message: "Coupon code required" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(400).json({ message: "Invalid coupon" });

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit exceeded" });
    }
    if (itemsPrice < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}` });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((itemsPrice * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }
    if (discount > itemsPrice) discount = itemsPrice;

    res.json({
      code: coupon.code,
      discount,
      newTotal: itemsPrice - discount,
      couponId: coupon._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
