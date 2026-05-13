import api from "./api";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

export async function getNotifications() {
  try {
    const response = await api.get("/Notifications");
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function markAsRead(notificationId) {
  try {
    const response = await api.put(`/Notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function markAllAsRead() {
  try {
    const response = await api.put("/Notifications/read-all");
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default { getNotifications, markAsRead, markAllAsRead };
