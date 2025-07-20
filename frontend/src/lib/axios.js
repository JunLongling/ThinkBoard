import axios from "axios";

// Normalize base URL to remove trailing slash if present
const baseURL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "") + "/api";

const api = axios.create({
  baseURL,
});

export default api;

