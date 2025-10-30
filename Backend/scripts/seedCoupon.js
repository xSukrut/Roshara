// Backend/scripts/seedCoupon.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Coupon from "../models/Coupon.js";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const code = "ROSHARA10";
    const existing = await Coupon.findOne({ code });
    if (existing) {
      existing.discountType = "percentage";
      existing.value = 10;
      existing.minOrderAmount = 1899;
      existing.active = true;
      await existing.save();
      console.log("♻️  Updated existing coupon:", code);
    } else {
      await Coupon.create({
        code,
        discountType: "percentage",
        value: 10,
        minOrderAmount: 1899,
        active: true,
      });
      console.log("✅ Created coupon:", code);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
