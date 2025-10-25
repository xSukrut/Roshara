import axios from "axios";
import { API_BASE_URL } from "../utils/api";

export const getAllCollections = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/collections`);
    return data;
  } catch (err) {
    console.error("Error fetching collections:", err.message);
    return [];
  }
};
