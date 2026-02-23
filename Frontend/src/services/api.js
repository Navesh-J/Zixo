import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("zixo_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        config.headers["X-User-Name"] = decoded.sub;
      } catch (e) {
        console.error("Invalid token");
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("zixo_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
