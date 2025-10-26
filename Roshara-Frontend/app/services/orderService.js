// /app/services/orderService.js
import api from "../../lib/apiClient";

// Create order (requires auth)
export const createOrder = async (token, payload) => {
  const res = await api.post("/orders", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // => the created order
};

// Get order by id (requires auth)
export const getOrderById = async (token, id) => {
  const res = await api.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Mark order paid via UPI (requires auth)
// we include the transactionId you collect on the UI
export const markPaidUPI = async (token, id, transactionId) => {
  const res = await api.post(
    `/orders/${id}/pay-upi`,
    { transactionId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
