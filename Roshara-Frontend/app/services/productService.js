
import api from "../../lib/apiClient";


export const getAllProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.featured) params.set("featured", "true");
  if (filters.collection) params.set("collection", filters.collection);
  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get(`/products${qs}`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
