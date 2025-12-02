import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

// Always attach token correctly from ats_auth
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("ats_auth");
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Token parse error:", e);
    }
  }
  return config;
});

export default api;
