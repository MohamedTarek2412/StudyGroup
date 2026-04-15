import api from "./api";

const NOTIFICATIONS_BASE_PATH = "/notifications";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

// 🔹 Get my notifications
export async function getNotifications() {
  try {
    const response = await api.get(NOTIFICATIONS_BASE_PATH);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

// 🔹 Mark as read
export async function markAsRead(notificationId) {
  try {
    await api.put(`${NOTIFICATIONS_BASE_PATH}/${notificationId}/read`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default {
  getNotifications,
  markAsRead,
}; 
