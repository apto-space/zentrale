"use client";
import ChatMessages from "./ChatMessages";
import { useAnonSession } from "../hooks/useAnonSession";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./ConversationSidebar";
import { useConversationChatV2 } from "../hooks/useConversationChatV2";

// next steps
// decoding conversations
// navigating fixes (fresh (replacestate))

export const ChatPage = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    append,
    id,
  } = useConversationChatV2();

  const handleQuestionClick = (question: string) => {
    // Set the input value to the clicked question
    append({
      role: "user",
      content: question,
    });
  };

  return (
    <div className="h-screen flex">
      <ConversationSidebar />
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
            <ChatMessages
              messages={messages}
              isLoading={status == "streaming"}
            />
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
};
