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
    const response = await api.get("/notifications");
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function markAsRead(notificationId) {
  try {
    await api.patch(`/notifications/${notificationId}/read`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function markAllAsRead() {
  try {
    await api.patch("/notifications/read-all");
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default { getNotifications, markAsRead, markAllAsRead };
