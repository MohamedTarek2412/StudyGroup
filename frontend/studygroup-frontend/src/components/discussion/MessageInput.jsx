import React, { useState } from "react";

const MessageInput = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        padding: "12px 16px",
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#fff",
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
        disabled={disabled}
        rows={1}
        style={{
          flex: 1,
          resize: "none",
          border: "1px solid #d1d5db",
          borderRadius: "20px",
          padding: "10px 16px",
          fontSize: "14px",
          outline: "none",
          fontFamily: "inherit",
          lineHeight: "1.4",
        }}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        style={{
          backgroundColor: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "20px",
          padding: "0 20px",
          cursor: text.trim() && !disabled ? "pointer" : "not-allowed",
          opacity: !text.trim() || disabled ? 0.5 : 1,
          fontSize: "14px",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
