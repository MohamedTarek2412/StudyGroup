import axios from "axios";
import { API_BASE_URL } from "../config/env";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/authStorage";
import { API_ERROR_CODES } from "../utils/constants";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Auth header interceptor ---
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor with refresh token logic ---
let isRefreshing = false;
let refreshRequestPromise = null;
const requestQueue = [];

const processQueue = (error, token = null) => {
  requestQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
      return;
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    resolve(api(config));
  });

  requestQueue.length = 0;
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      { withCredentials: true }
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data || {};

    if (!newAccessToken) {
      throw new Error("NO_ACCESS_TOKEN_IN_REFRESH_RESPONSE");
    }

    setTokens({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken || refreshToken,
    });

    return newAccessToken;
  } catch (error) {
    clearTokens();
    throw error;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // Only handle 401 (unauthorized) for refresh logic
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Mark request so we don't infinite loop
    originalRequest._retry = true;

    // If already refreshing, queue the request to be retried
    if (isRefreshing && refreshRequestPromise) {
      return new Promise((resolve, reject) => {
        requestQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;
    refreshRequestPromise = refreshAccessToken();

    try {
      const newAccessToken = await refreshRequestPromise;
      processQueue(null, newAccessToken);

      // Retry the original request with new token
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Attach a normalized error code if available
      const normalizedError = {
        ...refreshError,
        code: API_ERROR_CODES.UNAUTHORIZED,
      };

      return Promise.reject(normalizedError);
    } finally {
      isRefreshing = false;
      refreshRequestPromise = null;
    }
  }
);

export default api;

 
