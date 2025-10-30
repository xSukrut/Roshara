// controllers/couponController.js
import Coupon from "../models/Coupon.js";


export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      active: true,
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gte: now } }],
    }).sort({ createdAt: -1 });

    res.json(coupons);
  } catch (err) {
    console.error("getActiveCoupons error:", err.message);
    res.status(500).json({ message: "Failed to fetch active coupons" });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error("getAllCoupons error:", err.message);
    res.status(500).json({ message: "Failed to load coupons" });
  }
};


export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description = "",
      discountType = "percentage",
      value,
      minOrderAmount = 0,
      maxDiscount = 0,
      expiryDate,
      active = true,
    } = req.body;

    if (!code || !value) {
      return res.status(400).json({ message: "Code and value are required" });
    }

    const exists = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (exists) return res.status(400).json({ message: "Coupon already exists" });

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      description,
      discountType,
      value,
      minOrderAmount,
      maxDiscount,
      expiryDate,
      active,
    });

    res.status(201).json(coupon);
  } catch (err) {
    console.error("createCoupon error:", err.message);
    res.status(500).json({ message: "Failed to create coupon" });
  }
};

/**
 * ADMIN: update coupon
 * PUT /api/coupons/:id
 */
export const updateCoupon = async (req, res) => {
  try {
    const c = await Coupon.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Coupon not found" });

    const fields = [
      "code",
      "description",
      "discountType",
      "value",
      "minOrderAmount",
      "maxDiscount",
      "expiryDate",
      "active",
    ];
    for (const f of fields) {
      if (req.body[f] !== undefined) c[f] = f === "code" ? String(req.body[f]).toUpperCase() : req.body[f];
    }
    const saved = await c.save();
    res.json(saved);
  } catch (err) {
    console.error("updateCoupon error:", err.message);
    res.status(500).json({ message: "Failed to update coupon" });
  }
};

/**
 * ADMIN: delete coupon
 * DELETE /api/coupons/:id
 */
export const deleteCoupon = async (req, res) => {
  try {
    const c = await Coupon.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Coupon not found" });
    await c.deleteOne();
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    console.error("deleteCoupon error:", err.message);
    res.status(500).json({ message: "Failed to delete coupon" });
  }
};
