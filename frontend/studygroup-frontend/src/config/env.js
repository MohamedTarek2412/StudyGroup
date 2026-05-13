// Centralized environment configuration for frontend URLs

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const FRONTEND_BASE_URL =
  process.env.REACT_APP_FRONTEND_BASE_URL || "http://localhost:3000";

export { API_BASE_URL, SOCKET_URL, FRONTEND_BASE_URL };

export default {
  API_BASE_URL,
  SOCKET_URL,
  FRONTEND_BASE_URL,
};