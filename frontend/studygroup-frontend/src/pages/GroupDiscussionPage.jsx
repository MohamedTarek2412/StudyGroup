import React from "react";
import { useParams } from "react-router-dom";
import { useDiscussion } from "../hooks/useDiscussion";
import MessageList from "../components/discussion/MessageList";
import MessageInput from "../components/discussion/MessageInput";

const GroupDiscussionPage = () => {
  const { groupId } = useParams();
  const { messages, addMessage } = useDiscussion(groupId);

  return (
    <div>
      <h2>Discussion</h2>

      <MessageList messages={messages} />

      <MessageInput onSend={addMessage} />
    </div>
  );
};

export default GroupDiscussionPage;
