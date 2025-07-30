// ✅ Correct axios instance (updated)
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", 
  // Agar .env me REACT_APP_API_URL set hai to use karega, 
  // warna local development ke liye localhost use karega
});

// ✅ Request Interceptor: Token set karega
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Token expire handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.error === "jwt expired"
    ) {
      alert("⚠️ Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
