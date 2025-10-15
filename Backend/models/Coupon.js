import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true }, // percentage or fixed
  value: { type: Number, required: true }, // if percentage: 10 = 10%, if fixed: 100 = ₹100
  minOrderAmount: { type: Number, default: 0 }, // min itemsPrice to apply
  usageLimit: { type: Number, default: 0 }, // 0 = unlimited
  usedCount: { type: Number, default: 0 },
  expiryDate: { type: Date },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
