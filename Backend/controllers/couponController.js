// controllers/couponController.js
import Coupon from "../models/couponModel.js"; 

// PUBLIC: active coupons for checkout
export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      active: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },                 // ✅ include null expiry
        { expiryDate: { $gte: now } },
      ],
    }).sort({ createdAt: -1 });

    res.json(coupons);
  } catch (err) {
    console.error("getActiveCoupons error:", err);
    res.status(500).json({ message: "Failed to fetch active coupons" });
  }
};

// ADMIN: list all
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error("getAllCoupons error:", err);
    res.status(500).json({ message: "Failed to load coupons" });
  }
};

// ADMIN: create
export const createCoupon = async (req, res) => {
  try {
    let {
      code,
      description = "",
      discountType = "percentage", // "percentage" | "amount"
      value,
      minOrderAmount = 0,
      maxDiscount = 0,
      expiryDate,
      active = true,
    } = req.body;

    if (!code || value === undefined || value === null) {
      return res.status(400).json({ message: "Code and value are required" });
    }

    code = String(code).toUpperCase().trim();
    discountType = discountType === "amount" ? "amount" : "percentage"; // ✅ normalize

    const exists = await Coupon.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code,
      description,
      discountType,
      value: Number(value),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      expiryDate: expiryDate ? new Date(expiryDate) : null, // ✅ store null if empty
      active: !!active,
    });

    res.status(201).json(coupon);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Coupon code must be unique" });
    }
    console.error("createCoupon error:", err);
    res.status(500).json({ message: "Failed to create coupon" });
  }
};

// ADMIN: update
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
      if (req.body[f] !== undefined) {
        if (f === "code") c.code = String(req.body[f]).toUpperCase().trim();
        else if (f === "discountType")
          c.discountType = req.body[f] === "amount" ? "amount" : "percentage";
        else if (["value", "minOrderAmount", "maxDiscount"].includes(f))
          c[f] = Number(req.body[f]) || 0;
        else if (f === "expiryDate")
          c.expiryDate = req.body[f] ? new Date(req.body[f]) : null;
        else if (f === "active")
          c.active = !!req.body[f];
        else c[f] = req.body[f];
      }
    }

    const saved = await c.save();
    res.json(saved);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Coupon code must be unique" });
    }
    console.error("updateCoupon error:", err);
    res.status(500).json({ message: "Failed to update coupon" });
  }
};

// ADMIN: delete
export const deleteCoupon = async (req, res) => {
  try {
    const c = await Coupon.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Coupon not found" });
    await c.deleteOne();
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    console.error("deleteCoupon error:", err);
    res.status(500).json({ message: "Failed to delete coupon" });
  }
};
