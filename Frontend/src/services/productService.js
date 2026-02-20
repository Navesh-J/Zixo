import api from "./api";

export const getAllProducts = async () => {
  const { data } = await api.get("/product-service/products");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/product-service/products/${id}`);
  return data;
};

export const getMyProducts = async (username) => {
  const response = await api.get("/product-service/products/my");
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post("/product-service/products/add", product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/product-service/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/product-service/products/${id}`);
};

export const getStock = async (id) => {
  const response = await api.get(`/inventory-service/inventory/${id}`);
  return response.data;
};

export const updateStock = async (productId, stock) => {
  const response = await api.put(`/inventory-service/inventory/${productId}`, {
    quantity: Number(stock),
  });
  return response.data;
};
