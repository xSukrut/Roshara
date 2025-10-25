// services/couponService.js
import api from "../lib/apiClient";

export const validateCoupon = async (code, orderAmount) => {
  const res = await api.post("/coupons/validate", { code, orderAmount });
  return res.data;
};

export const applyCoupon = async (code, totalAmount) => {
  const res = await api.post("/coupons/apply", { code, totalAmount });
  return res.data;
};
