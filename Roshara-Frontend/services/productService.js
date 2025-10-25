import axios from "axios";
import { API_BASE_URL } from "../utils/api";

export const getAllProducts = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/products`);
    return data;
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return [];
  }
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
