"use client";
import ChatMessages from "./ChatMessages";
import { useAnonSession } from "../hooks/useAnonSession";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./ConversationSidebar";
import { useConversationChat } from "../hooks/useConversationChat";

// next steps
// anon auth to keep history
// init DB

export const ChatPage = () => {
  const { id: sessionId } = useAnonSession();
  const { messages, input, handleInputChange, handleSubmit, status, append } =
    useConversationChat(sessionId);

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
