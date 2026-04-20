import { useContext } from "react";
import NotificationContext from "../context/NotificationContext";
import { markAsRead, markAllAsRead, getNotifications } from "../services/notificationService";

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    ctx.markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    ctx.markAllAsRead();
  };

  const loadNotifications = async () => {
    const data = await getNotifications();
    // Sync context with persisted notifications
    if (Array.isArray(data)) {
      data.forEach((n) => {
        if (!n.isRead) ctx.addNotification(n);
      });
    }
    return data;
  };

  return {
    ...ctx,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    loadNotifications,
  };
}

export default useNotifications;
