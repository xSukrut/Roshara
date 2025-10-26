import api from "../../lib/apiClient";

export const createOrder = async (token, payload) => {
  const res = await api.post("/orders", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // order
};

export const getOrder = async (token, id) => {
  const res = await api.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markPaidUPI = async (token, id, transactionId) => {
  const res = await api.post(
    `/orders/${id}/pay-upi`,
    { transactionId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
