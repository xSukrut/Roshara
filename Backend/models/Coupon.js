import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
 code: { type: String, unique: true, required: true },
discountType: { type: String, enum: ["percentage", "fixed"], required: true },
value: { type: Number, required: true },
minOrderAmount: { type: Number, default: 0 },
expiryDate: { type: Date },
usageLimit: { type: Number, default: 0 },
usedCount: { type: Number, default: 0 },
active: { type: Boolean, default: true },
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
