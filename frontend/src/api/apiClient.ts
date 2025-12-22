import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  withCredentials: true, // 🔑 cookies / token ke liye MUST
});

export default apiClient;
