"use client";
import { ChatMessages } from "./ChatMessages";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { OpenButton } from "./ConversationSidebar";
import { type ChatAppConfig } from "../core/ChatAppConfig";
import {
  useConversationChat,
  type UseChatInterface,
} from "../hooks/useConversationChat";

// next steps
// decoding conversations
// navigating fixes (fresh (replacestate))

interface ChatPageProps {
  conversationId: string;
  onConversationUpdate?: () => void;
  config: ChatAppConfig;
}

export const ChatPage = ({
  conversationId,
  onConversationUpdate,
  config,
}: ChatPageProps) => {
  const chat = useConversationChat(conversationId, onConversationUpdate);
  return <ChatPageInner chat={chat} />;
};
export const ChatPageInner = ({ chat }: { chat: UseChatInterface }) => {
  const handleQuestionClick = (question: string) => {
    // Set the input value to the clicked question
    append({
      role: "user",
      content: question,
    });
  };
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    append,
    stop,
    reload,
    handleFeedback,
  } = chat;

  return (
    <div className="flex-1 flex flex-col">
      <div className="fixed top-0 left-0 w-full   z-10 flex">
        <div className=" flex-1">
          <OpenButton />
        </div>
        <div className="  w-full grow justify-center max-w-4xl">
          {messages.length > 0 && (
            <div className="p-4 border-[var(--card-border)]">
              <h1 className="text-lg font-medium">{config.name}</h1>
            </div>
          )}
        </div>
        <div className=" flex-1"></div>
      </div>
      <div className="top-0 left-0 w-full   z-10 flex opacity-0">
        <div className=" flex-1">
          <OpenButton />
        </div>
        <div className="  w-full grow justify-center max-w-4xl">
          {messages.length > 0 && (
            <div className="p-4 border-[var(--card-border)]">
              <h1 className="text-lg font-medium">{config.name}</h1>
            </div>
          )}
        </div>
        <div className=" flex-1"></div>
      </div>
      {messages.length === 0 ? (
        <EmptyState
          onQuestionClick={handleQuestionClick}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          status={status}
          onStop={stop}
          examples={config.options?.examples}
          greeting={config.options?.greeting}
        />
      ) : (
        <>
          <ChatMessages
            messages={messages}
            status={status}
            onFeedback={handleFeedback}
            onReload={
              status === "ready" || status === "error" ? reload : undefined
            }
          />
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            status={status}
            onStop={stop}
          />
        </>
      )}
    </div>
  );
};
