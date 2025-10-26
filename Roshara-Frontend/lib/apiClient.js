// lib/apiClient.js
import axios from "axios";

// ✅ Base API configuration for all requests
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;

