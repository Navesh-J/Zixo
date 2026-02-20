import api from "./api";

const BASE_URL = "/order-service/orders";

// 🛒 Create Order
export const createOrder = async (orderItems) => {
  const { data } = await api.post(BASE_URL, orderItems);
  return data;
};

// 📦 Get My Orders
export const getMyOrders = async () => {
  const { data } = await api.get(`${BASE_URL}/my`);
  return data;
};

// ❌ Cancel Order
export const cancelOrder = async (orderId, reason) => {
  const { data } = await api.post(`${BASE_URL}/${orderId}/cancel`, {
    reason,
  });
  return data;
};

// 💳 Pay Order
export const payOrder = async (orderId) => {
  const { data } = await api.post(`${BASE_URL}/${orderId}/pay`);
  return data;
};

export const getSellerAnalytics = async () => {
  const response = await api.get(
    "/order-service/orders/seller/analytics"
  );
  return response.data;
};

export const getSellerOrders = async () => {
  const response = await api.get(
    "/order-service/orders/seller/orders"
  );
  return response.data;
};
