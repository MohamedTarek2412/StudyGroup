import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
} 
