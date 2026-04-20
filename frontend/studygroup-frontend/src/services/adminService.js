import api from "./api";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

export async function getPendingGroups() {
  try {
    const response = await api.get("/admin/groups/pending");
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function approveGroup(groupId) {
  try {
    await api.post(`/admin/groups/${groupId}/approve`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function rejectGroup(groupId) {
  try {
    await api.post(`/admin/groups/${groupId}/reject`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function getAllUsers() {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function approveCreator(userId) {
  try {
    await api.post(`/admin/users/${userId}/approve-creator`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default { getPendingGroups, approveGroup, rejectGroup, getAllUsers, approveCreator };
