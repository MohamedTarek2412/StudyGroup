 import MessageBubble from "./MessageBubble";

export default function MessageList({ messages }) {
  if (!messages.length) return <p>No messages yet</p>;

  return (
    <div>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}
