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

export const updateProduct = async (id, values, file) => {

  // If uploading new image
  if (file) {
    const formData = new FormData();

    formData.append("productName", values.productName);
    formData.append("productDescription", values.productDescription || "");
    formData.append("price", values.price);
    formData.append("image", file);

    const response = await api.put(
      `/product-service/products/${id}/with-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }

  // Normal JSON update (no image change)
  const response = await api.put(
    `/product-service/products/${id}`,
    values
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/product-service/products/${id}`);
};

export const createProductWithImageUrl = async (data) => {
  const response = await api.post(
    "/product-service/products/add",
    data
  );
  return response.data;
};

export const createProductWithUpload = async (values, file) => {
  const formData = new FormData();

  formData.append("productName", values.productName);
  formData.append("productDescription", values.productDescription);
  formData.append("price", values.price);
  formData.append("initialStock", values.initialStock);
  formData.append("image", file);

  const response = await api.post(
    "/product-service/products/add-with-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
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
