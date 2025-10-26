
import api from "../../lib/apiClient";

export const getAllCollections = async () => {
  const res = await api.get("/collections");
  return res.data;
};

export const getCollectionById = async (id) => {
  const res = await api.get(`/collections/${id}`);
  return res.data;
};
