import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as signalR from "@microsoft/signalr";

import { AUTH_TOKENS_CHANGED_EVENT, getAccessToken } from "../utils/authStorage";

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
  const [isHubEnabled, setIsHubEnabled] = useState(() => Boolean(getAccessToken()));

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
    let connectionInstance = null;

    const hasToken = () => Boolean(getAccessToken());
    const logLevel =
      process.env.NODE_ENV === "production"
        ? signalR.LogLevel.Warning
        : signalR.LogLevel.Information;

    const startOrStop = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsHubEnabled(false);
        setConnection(null);
        if (connectionInstance) {
          try {
            await connectionInstance.stop();
          } catch {
            // ignore
          }
        }
        connectionInstance = null;
        return;
      }

      // If a connection already exists, replace it to pick up latest token
      if (connectionInstance) {
        try {
          await connectionInstance.stop();
        } catch {
          // ignore
        }
        connectionInstance = null;
      }

      setIsHubEnabled(true);

      connectionInstance = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => getAccessToken() || "",
        })
        // Longer keep-alive to reduce "abnormal closure" in dev environments (@microsoft/signalr v8: withServerTimeout, not *InMilliseconds)
        .withServerTimeout(120000)
        .withKeepAliveInterval(15000)
        .withAutomaticReconnect([0, 2000, 10000, 30000, 60000])
        .configureLogging(logLevel)
        .build();

      connectionInstance.on("ReceiveNotification", (notification) => {
        if (!isMounted) return;
        addNotification({
          id: notification.id || Date.now().toString(),
          ...notification,
          isRead: notification.isRead ?? false,
        });
      });

      try {
        await connectionInstance.start();
        if (!isMounted) {
          await connectionInstance.stop();
          return;
        }
        setConnection(connectionInstance);
      } catch {
        // If API is down/restarting, client will try again on token updates / user refresh
        setConnection(null);
      }
    };

    // Initial bind (covers refresh with existing token)
    void startOrStop();

    const onTokenChanged = () => {
      void startOrStop();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible" && hasToken()) {
        // Best-effort: restart if the socket died while the tab slept
        void startOrStop();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(AUTH_TOKENS_CHANGED_EVENT, onTokenChanged);
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener(AUTH_TOKENS_CHANGED_EVENT, onTokenChanged);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      (async () => {
        try {
          if (connectionInstance) await connectionInstance.stop();
        } catch {
          // ignore
        } finally {
          setConnection(null);
        }
      })();
    };
  }, [hubUrl, addNotification]);

  const value = useMemo(
    () => ({
      connection,
      isHubEnabled,
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    }),
    [
      connection,
      isHubEnabled,
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

 
