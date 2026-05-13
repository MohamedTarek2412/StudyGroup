import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, currentUserId, onDelete }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0", fontSize: "14px" }}>
        No messages yet. Be the first to say something!
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "16px", overflowY: "auto", flex: 1 }}>
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.senderId === currentUserId}
          canDelete={msg.senderId === currentUserId}
          onDelete={onDelete}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;

