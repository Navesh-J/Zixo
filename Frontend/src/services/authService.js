import api from "./api";

export const loginUser = async (credentials) => {
  const { data } = await api.post(
    "/auth-service/auth/login",
    credentials
  );
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post(
    "/auth-service/auth/register",
    userData
  );
  return data;
};
