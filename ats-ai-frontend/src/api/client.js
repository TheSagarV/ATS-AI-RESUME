import axios from "axios";

// In Vercel production, use the relative /api path (handled by vercel.json rewrites)
// In local development, default to http://localhost:5000/api
const baseURL = import.meta.env.PROD ? "/api" : "http://localhost:5000/api";

const api = axios.create({
  baseURL,
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
