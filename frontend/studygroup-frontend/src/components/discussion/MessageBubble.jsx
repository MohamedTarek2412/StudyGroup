export default function MessageBubble({ message }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <strong>{message.user}:</strong>
      <p>{message.content}</p>
    </div>
  );
} 
