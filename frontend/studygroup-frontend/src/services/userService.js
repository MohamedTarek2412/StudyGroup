import api from "./api";

const USERS_BASE_PATH = "/users";

export const getProfile = async () => {
  const response = await api.get(`${USERS_BASE_PATH}/me`);
  return response.data;
};

export const updateProfile = async (payload) => {
  // payload: { name, avatar, ... } حسب تصميم الـ backend
  const response = await api.put(`${USERS_BASE_PATH}/me`, payload);
  return response.data;
};

// قابلة للتوسع: أمثلة لاستدعاءات أخرى لو احتجتها
export const getUserById = async (userId) => {
  const response = await api.get(`${USERS_BASE_PATH}/${userId}`);
  return response.data;
};

export const listUsers = async (params = {}) => {
  const response = await api.get(USERS_BASE_PATH, { params });
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  getUserById,
  listUsers,
};

 
