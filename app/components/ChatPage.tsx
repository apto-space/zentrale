"use client";
import ChatMessages from "./ChatMessages";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./ConversationSidebar";
import { useConversationChatV2 } from "../hooks/useConversationChatV2";

// next steps
// decoding conversations
// navigating fixes (fresh (replacestate))

interface ChatPageProps {
  conversationId: string;
  onConversationUpdate?: () => void;
}

export const ChatPage = ({
  conversationId,
  onConversationUpdate,
}: ChatPageProps) => {
  const { messages, input, handleInputChange, handleSubmit, status, append } =
    useConversationChatV2(conversationId, onConversationUpdate);
  const lastMessage = messages[messages.length - 1];
  console.log("lastMessage", lastMessage);

  const handleQuestionClick = (question: string) => {
    // Set the input value to the clicked question
    append({
      role: "user",
      content: question,
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {messages.length === 0 ? (
        <EmptyState
          onQuestionClick={handleQuestionClick}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <>
          <ChatMessages messages={messages} isLoading={status == "streaming"} />
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
};
