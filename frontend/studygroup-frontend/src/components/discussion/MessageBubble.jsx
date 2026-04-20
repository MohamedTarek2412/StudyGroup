import React from "react";
import { formatRelativeTime } from "../../utils/formatDate";

const MessageBubble = ({ message, isOwn, onDelete, canDelete }) => {
  const bubbleStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: isOwn ? "flex-end" : "flex-start",
    marginBottom: "12px",
  };

  const contentStyle = {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    backgroundColor: isOwn ? "#4f46e5" : "#f3f4f6",
    color: isOwn ? "#fff" : "#111827",
    fontSize: "14px",
    lineHeight: "1.5",
    wordBreak: "break-word",
  };

  const metaStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
    fontSize: "11px",
    color: "#9ca3af",
  };

  return (
    <div style={bubbleStyle}>
      {!isOwn && (
        <span style={{ fontSize: "12px", color: "#6b7280", marginBottom: "2px", fontWeight: 600 }}>
          {message.senderName}
        </span>
      )}
      <div style={contentStyle}>{message.content}</div>
      <div style={metaStyle}>
        <span>{formatRelativeTime(message.sentAt)}</span>
        {canDelete && (
          <button
            onClick={() => onDelete && onDelete(message.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#ef4444",
              fontSize: "11px",
              padding: "0",
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
