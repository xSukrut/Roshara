// app/services/orderService.js
import api from "../../lib/apiClient";

/**
 * Create an order (COD or UPI)
 * token: JWT from AuthContext
 * payload: { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, couponCode? }
 */
export const createOrder = async (token, payload) => {
  const res = await api.post("/orders", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // returns created order
};

/**
 * Mark an order paid (simulated UPI success)
 */
export const markPaidUPI = async (token, id, transactionId) => {
  const res = await api.post(
    `/orders/${id}/pay-upi`,
    { transactionId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

/**
 * Get an order by id
 */
export const getOrderById = async (token, id) => {
  const res = await api.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
