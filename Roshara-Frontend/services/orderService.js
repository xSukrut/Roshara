// app/services/orderService.js
import api from "../lib/apiClient";

// Create order (authenticated)
export const createOrder = async (token, payload) => {
  const res = await api.post("/orders", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // returns { _id, ... }
};

// Get one order (authenticated)
export const getOrderById = async (token, id) => {
  const res = await api.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Mark UPI paid (simulated) (authenticated)
export const markPaidUPI = async (token, id) => {
  const res = await api.post(`/orders/${id}/pay-upi`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
