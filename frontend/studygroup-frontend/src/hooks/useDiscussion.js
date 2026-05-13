import { useState, useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../utils/authStorage";
import { SOCKET_URL } from "../config/env";
import { getMessages } from "../services/discussionService";

export function useDiscussion(groupId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const connectionRef = useRef(null);

  // Load history from REST
  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    getMessages(groupId)
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [groupId]);

  // Setup SignalR
  useEffect(() => {
    if (!groupId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${SOCKET_URL}/hubs/discussion`, {
        accessTokenFactory: () => getAccessToken(),
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on("ReceiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    connection.on("Error", (msg) => {
      console.error("SignalR error:", msg);
    });

    connection
      .start()
      .then(() => {
        setConnected(true);
        return connection.invoke("JoinGroup", groupId);
      })
      .catch((err) => console.error("SignalR connection failed:", err));

    connectionRef.current = connection;

    return () => {
      connection.invoke("LeaveGroup", groupId).catch(() => {});
      connection.stop();
      setConnected(false);
    };
  }, [groupId]);

  const sendMessage = useCallback(
    async (content) => {
      const conn = connectionRef.current;
      if (conn && conn.state === signalR.HubConnectionState.Connected) {
        await conn.invoke("SendMessage", groupId, content);
      } else {
        // Fallback: REST
        const { sendMessage: sendRest } = await import("../services/discussionService");
        const msg = await sendRest(groupId, content);
        setMessages((prev) => [...prev, msg]);
      }
    },
    [groupId]
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      const { deleteMessage: deleteRest } = await import("../services/discussionService");
      await deleteRest(groupId, messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    },
    [groupId]
  );

  return { messages, loading, error, connected, sendMessage, deleteMessage };
}

export default useDiscussion;
