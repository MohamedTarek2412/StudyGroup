import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as signalR from "@microsoft/signalr";

import { AUTH_TOKENS_CHANGED_EVENT, getAccessToken } from "../utils/authStorage";

import { SOCKET_URL } from "../config/env";

const NotificationContext = createContext(null);

const DEFAULT_HUB_PATH = "/hubs/notifications";

export const NotificationProvider = ({ children, hubUrl: hubUrlProp }) => {
  const hubUrlResolved = useMemo(
    () => hubUrlProp ?? `${SOCKET_URL}${DEFAULT_HUB_PATH}`,
    [hubUrlProp]
  );
  const hubUrlRef = useRef(hubUrlResolved);
  hubUrlRef.current = hubUrlResolved;

  const connectionRef = useRef(null);
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isHubEnabled, setIsHubEnabled] = useState(() => Boolean(getAccessToken()));
  const lastTokenRef = useRef(null);
  const debounceTimerRef = useRef(null);

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
        lastTokenRef.current = null;
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
        connectionRef.current = null;
        return;
      }

      // Avoid tearing down a healthy connection when the token did not change
      const live = connectionRef.current;
      if (
        token === lastTokenRef.current &&
        live &&
        live.state === signalR.HubConnectionState.Connected
      ) {
        return;
      }
      lastTokenRef.current = token;

      // If a connection already exists, replace it to pick up latest token
      if (connectionInstance || connectionRef.current) {
        const toStop = connectionInstance || connectionRef.current;
        try {
          await toStop.stop();
        } catch {
          // ignore
        }
        connectionInstance = null;
        connectionRef.current = null;
      }

      setIsHubEnabled(true);

      connectionInstance = new signalR.HubConnectionBuilder()
        .withUrl(hubUrlRef.current, {
          accessTokenFactory: () => getAccessToken() || "",
        })
        // Longer keep-alive to reduce "abnormal closure" in dev environments (@microsoft/signalr v8: withServerTimeout, not *InMilliseconds)
        .withServerTimeout(120000)
        .withKeepAliveInterval(15000)
        .withAutomaticReconnect([0, 2000, 10000, 30000, 60000])
        .configureLogging(logLevel)
        .build();

      connectionInstance.onreconnecting((error) => {
        console.log("WebSocket reconnecting...", error);
      });

      connectionInstance.onreconnected((connectionId) => {
        console.log("WebSocket reconnected. Connection ID:", connectionId);
      });

      connectionInstance.onclose((error) => {
        console.log("WebSocket disconnected.", error);
      });

      connectionInstance.on("ReceiveNotification", (notification) => {
        console.log("received notification", notification);
        if (!isMounted) return;

        // Normalize JSON casing to handle both camelCase and PascalCase
        const id = notification.id || notification.Id || Date.now().toString();
        const message = notification.message || notification.Message || "";
        const isRead = notification.isRead ?? notification.IsRead ?? false;
        const createdAt = notification.createdAt || notification.CreatedAt || new Date().toISOString();

        addNotification({
          id,
          message,
          isRead,
          createdAt,
        });
      });

      try {
        await connectionInstance.start();
        if (process.env.NODE_ENV !== "production") {
          console.log("WebSocket connected.");
        }
        if (!isMounted) {
          await connectionInstance.stop();
          connectionRef.current = null;
          return;
        }
        connectionRef.current = connectionInstance;
        setConnection(connectionInstance);
      } catch {
        connectionRef.current = null;
        setConnection(null);
      }
    };

    // Initial bind (covers refresh with existing token)
    void startOrStop();

    const onTokenChanged = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        void startOrStop();
      }, 400);
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible" || !hasToken()) return;
      const c = connectionRef.current;
      if (c && c.state === signalR.HubConnectionState.Connected) return;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        void startOrStop();
      }, 400);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(AUTH_TOKENS_CHANGED_EVENT, onTokenChanged);
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      isMounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      if (typeof window !== "undefined") {
        window.removeEventListener(AUTH_TOKENS_CHANGED_EVENT, onTokenChanged);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      (async () => {
        try {
          const toClose = connectionInstance || connectionRef.current;
          if (toClose) await toClose.stop();
        } catch {
          // ignore
        } finally {
          connectionRef.current = null;
          setConnection(null);
        }
      })();
    };
    // Hub URL is read from hubUrlRef; addNotification is stable (useCallback).
  }, []);

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


