// /app/services/orderService.js
import api from "../../lib/apiClient";

/**
 * Create an order (auth required)
 * @param {string} token - JWT
 * @param {object} payload - { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, couponCode? }
 * orderItems = [{ product, quantity }]
 */
export const createOrder = async (token, payload) => {
  const res = await api.post("/orders", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // created order
};

/**
 * Get order by id (auth required)
 */
export const getOrderById = async (token, id) => {
  const res = await api.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Simulate payment success for UPI (auth required)
 */
export const markPaidUPI = async (token, id, body = {}) => {
  const res = await api.post(`/orders/${id}/pay-upi`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
