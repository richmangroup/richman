// ✅ Correct axios instance
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Now points to /api/users
});

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
