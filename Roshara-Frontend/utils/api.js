export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")) ||
  "http://localhost:5000/api";