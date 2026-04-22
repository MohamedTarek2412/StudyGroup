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
  // NOTE: Current backend exposes notifications via SignalR hub (/hubs/notifications)
  // and does not provide REST endpoints under /api/notifications in Swagger.
  // So we return an empty list to avoid noisy 404s.
  return [];
}

export async function markAsRead(notificationId) {
  // No REST endpoint available in backend for this action.
  return true;
}

export async function markAllAsRead() {
  // No REST endpoint available in backend for this action.
  return true;
}

export default { getNotifications, markAsRead, markAllAsRead };
