import React, { useState, useEffect, useRef } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { getNotifications } from "../../services/notificationService";
import { formatRelativeTime } from "../../utils/formatDate";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dropdownRef = useRef(null);

  // Load persisted notifications on first open
  useEffect(() => {
    if (open && !loaded) {
      getNotifications()
        .then((data) => {
          if (Array.isArray(data)) {
            data.forEach((n) => addNotification(n));
          }
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    }
  }, [open, loaded, addNotification]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  // Deduplicate notifications by id
  const uniqueNotifications = notifications.reduce((acc, n) => {
    if (!acc.find((x) => x.id === n.id)) acc.push(n);
    return acc;
  }, []);

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: "4px",
          fontSize: "22px",
          lineHeight: 1,
        }}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-4px",
              backgroundColor: "#ef4444",
              color: "#fff",
              borderRadius: "9999px",
              fontSize: "10px",
              fontWeight: 700,
              minWidth: "16px",
              height: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: "320px",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "14px" }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4f46e5",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {uniqueNotifications.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
                No notifications yet
              </div>
            ) : (
              uniqueNotifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f9fafb",
                    backgroundColor: n.isRead ? "#fff" : "#eff6ff",
                    cursor: n.isRead ? "default" : "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{ fontSize: "13px", color: "#111827", marginBottom: "2px" }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                    {formatRelativeTime(n.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
