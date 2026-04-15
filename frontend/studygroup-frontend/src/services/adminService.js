import api from "./api";

const ADMIN_BASE_PATH = "/admin";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

// 🔹 Pending creators
export async function getPendingCreators() {
  try {
    const response = await api.get(`${ADMIN_BASE_PATH}/creators`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

// 🔹 Pending groups
export async function getPendingGroups() {
  try {
    const response = await api.get(`${ADMIN_BASE_PATH}/groups`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

// 🔹 Approve group
export async function approveGroup(groupId) {
  try {
    await api.put(`${ADMIN_BASE_PATH}/groups/${groupId}/approve`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default {
  getPendingCreators,
  getPendingGroups,
  approveGroup,
}; 
