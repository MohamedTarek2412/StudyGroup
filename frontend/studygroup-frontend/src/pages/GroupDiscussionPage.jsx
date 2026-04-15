import useDiscussion from "../hooks/useDiscussion";
import MessageList from "../components/discussion/MessageList";
import MessageInput from "../components/discussion/MessageInput";

export default function GroupDiscussionPage({ groupId }) {
  const { messages, sendMessage } = useDiscussion(groupId);

  return (
    <div>
      <h2>Group Discussion</h2>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
} 
