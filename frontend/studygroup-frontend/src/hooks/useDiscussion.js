 import { useEffect, useState, useCallback } from "react";
import discussionService from "../services/discussionService";

// 🔹 Mock Data fallback (مؤقت لحد ما backend 3 يشتغل)
const mockMessages = [
  { id: 1, content: "Hello Bavly 👋", user: "Admin" },
  { id: 2, content: "Welcome to the group!", user: "System" },
];

export default function useDiscussion(groupId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await discussionService.getGroupMessages(groupId);
      setMessages(data);
    } catch (err) {
      console.warn("Using mock data بسبب إن backend مش جاهز");
      setMessages(mockMessages); // fallback
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // 🔹 Send message
  const sendMessage = async (content) => {
    if (!groupId || !content) return;

    try {
      const newMessage = await discussionService.sendMessage(groupId, {
        content,
      });

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      // fallback mock add
      const fakeMessage = {
        id: Date.now(),
        content,
        user: "You",
      };

      setMessages((prev) => [...prev, fakeMessage]);
    }
  };

  // 🔹 Load on mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
  };
}
