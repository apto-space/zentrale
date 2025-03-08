import { useRef, useEffect } from "react";
import { Message } from "@ai-sdk/react";
import { ViewMessage } from "./ChatMessage";

export type ChatMessage = Message & {
  feedback: Feedback | null;
};

export type Feedback = {
  is_positive: boolean;
  feedback_text?: string;
};

export type MessagePart = {
  type: "text" | "tool-invocation";
  text?: string;
  toolInvocation?: any;
};

export type ChatMessagesProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  onFeedback?: (messageOffset: number, isPositive: boolean) => void;
  onRequestHuman?: () => void;
  onReload?: () => void;
};

export const ChatMessages = ({
  messages,
  isLoading,
  onFeedback,
  onRequestHuman,
  onReload,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log(messages);
  // make it so that the messages appear at the bottom

  return (
    // <div className="flex flex-1 flex-col h-full bg-purple-100">
    <div className=" overflow-y-auto p-4 space-y-4 flex-1 flex flex-col">
      {messages.length > 0 && onRequestHuman && <Dropout></Dropout>}
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }
          ${index == 0 ? "mt-auto" : ""}
          `}
        >
          <ViewMessage
            message={message}
            onFeedback={
              onFeedback
                ? (isPositive) => onFeedback(index, isPositive)
                : undefined
            }
            isLastMessage={index === messages.length - 1}
            onReload={onReload}
          />
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <div className="animate-spin">⚡</div>
          <span>Thinking...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
    // </div>
  );
};

const Dropout = () => {
  return (
    <div className="flex justify-center mb-4">
      <button
        onClick={() => alert("Talk to human")}
        className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--card-border)] hover:bg-[var(--card-background)] transition-colors"
      >
        <span>👥</span>
        Talk to a Human
      </button>
    </div>
  );
};
