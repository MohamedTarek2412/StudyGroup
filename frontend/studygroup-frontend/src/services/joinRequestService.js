import api from "./api";

const JOIN_REQUESTS_BASE_PATH = "/join-requests";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

export async function createJoinRequest(groupId) {
  try {
    const response = await api.post(JOIN_REQUESTS_BASE_PATH, { groupId });
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function getMyJoinRequests() {
  try {
    const response = await api.get(`${JOIN_REQUESTS_BASE_PATH}/mine`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function getJoinRequestsForGroup(groupId) {
  try {
    const response = await api.get(`${JOIN_REQUESTS_BASE_PATH}/group/${groupId}`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function approveJoinRequest(requestId) {
  try {
    await api.post(`${JOIN_REQUESTS_BASE_PATH}/${requestId}/approve`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function rejectJoinRequest(requestId) {
  try {
    await api.post(`${JOIN_REQUESTS_BASE_PATH}/${requestId}/reject`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default {
  createJoinRequest,
  getMyJoinRequests,
  getJoinRequestsForGroup,
  approveJoinRequest,
  rejectJoinRequest,
};

 
