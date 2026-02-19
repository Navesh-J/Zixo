import api from "./api";

export const getAllProducts = async () => {
  const { data } = await api.get("/product-service/products");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/product-service/products/${id}`);
  return data;
};
