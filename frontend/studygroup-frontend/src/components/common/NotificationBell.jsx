import useNotifications from "../../hooks/useNotifications";

export default function NotificationBell() {
  const { notifications, markAsRead } = useNotifications();

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      🔔 {unread}
      <div>
        {notifications.map((n) => (
          <div key={n.id} onClick={() => markAsRead(n.id)}>
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
} 
