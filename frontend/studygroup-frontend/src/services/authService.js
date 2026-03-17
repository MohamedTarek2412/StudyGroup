import api from "./api";
import { setTokens, clearTokens } from "../utils/authStorage";

const AUTH_BASE_PATH = "/auth";

export const login = async (credentials) => {
  // credentials: { email, password } أو أي فورمات تاني من الـ backend
  const response = await api.post(`${AUTH_BASE_PATH}/login`, credentials);

  const { accessToken, refreshToken, user } = response.data || {};

  if (accessToken || refreshToken) {
    setTokens({ accessToken, refreshToken });
  }

  return { user, accessToken, refreshToken };
};

export const register = async (payload) => {
  // payload: { name, email, password, ... }
  const response = await api.post(`${AUTH_BASE_PATH}/register`, payload);

  const { accessToken, refreshToken, user } = response.data || {};

  if (accessToken || refreshToken) {
    setTokens({ accessToken, refreshToken });
  }

  return { user, accessToken, refreshToken };
};

export const refresh = async () => {
  // في الأغلب مش هتحتاج تستخدمها مباشرة لأن الـ interceptor بيعمل refresh أوتوماتيك
  const response = await api.post(`${AUTH_BASE_PATH}/refresh`);

  const { accessToken, refreshToken } = response.data || {};

  if (accessToken || refreshToken) {
    setTokens({ accessToken, refreshToken });
  }

  return { accessToken, refreshToken };
};

export const logout = async () => {
  try {
    await api.post(`${AUTH_BASE_PATH}/logout`);
  } catch {
    // حتى لو السيرفر وقع، نفضي التوكنز محلياً
  } finally {
    clearTokens();
  }
};

export default {
  login,
  register,
  refresh,
  logout,
};

 
