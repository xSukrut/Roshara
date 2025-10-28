import api from "../../lib/apiClient";

const auth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createOrder = async (token, payload) => {
  const { data } = await api.post("/orders", payload, auth(token));
  return data;
};

export const submitUpiProof = async (token, id, transactionId) => {
  const { data } = await api.post(
    `/orders/${id}/upi-proof`,
    { transactionId },
    auth(token)
  );
  return data;
};

export const verifyOrderPayment = async (token, id, action, note) => {
  const { data } = await api.put(
    `/orders/${id}/verify`,
    { action, note },
    auth(token)
  );
  return data;
};

export const listOrdersAdmin = async (token, params = {}) => {
  const { data } = await api.get("/orders", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
};

// ✅ NEW: fetch a single order by ID
export const getOrderById = async (token, id) => {
  const { data } = await api.get(`/orders/${id}`, auth(token));
  return data;
};
