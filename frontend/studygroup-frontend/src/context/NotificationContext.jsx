import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as signalR from "@microsoft/signalr";

import { getAccessToken } from "../utils/authStorage";

import { SOCKET_URL } from "../config/env";

const NotificationContext = createContext(null);

const DEFAULT_HUB_PATH = "/hubs/notifications";

export const NotificationProvider = ({
  children,
  hubUrl = `${SOCKET_URL}${DEFAULT_HUB_PATH}`,
}) => {
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        isRead: true,
      }))
    );
    setUnreadCount(0);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              isRead: true,
            }
          : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    let isMounted = true;


    const connectionInstance = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => getAccessToken(),
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionInstance.on("ReceiveNotification", (notification) => {
      if (!isMounted) return;
      addNotification({
        id: notification.id || Date.now().toString(),
        ...notification,
        isRead: notification.isRead ?? false,
      });
    });

    const startConnection = async () => {
      try {
        await connectionInstance.start();
        if (!isMounted) {
          await connectionInstance.stop();
          return;
        }
        setConnection(connectionInstance);
      } catch {
        // ممكن تضيف هنا logging أو retry logic حسب احتياجك
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      connectionInstance
        .stop()
        .catch(() => {
          // ignore
        })
        .finally(() => {
          setConnection(null);
        });
    };
  }, [hubUrl, addNotification]);

  const value = useMemo(
    () => ({
      connection,
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    }),
    [
      connection,
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return ctx;
};

export default NotificationContext;

 
