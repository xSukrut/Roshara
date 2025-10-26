import api from "../../lib/apiClient";

export const validateCoupon = async (code, orderAmount) => {
  const res = await api.post("/coupons/validate", { code, orderAmount });
  return res.data; // { valid, discountType, value, message }
};
