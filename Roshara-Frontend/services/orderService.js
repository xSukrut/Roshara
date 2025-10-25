// services/orderService.js
import api from "../lib/apiClient";

export const createOrder = async (orderBody) => {
  const res = await api.post("/orders", orderBody);
  return res.data;
};

export const payOrderSimulated = async (orderId, couponCode) => {
  const res = await api.put(`/orders/${orderId}/pay`, { couponCode });
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/myorders");
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};
