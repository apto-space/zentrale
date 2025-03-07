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
interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onRequestHuman?: () => void;
  onFeedback?: (messageOffset: number, isPositive: boolean) => void;
}

export type MessagePart = {
  type: "text" | "tool-invocation";
  text?: string;
  toolInvocation?: any;
};

export default function ChatMessages({
  messages,
  isLoading = false,
  onRequestHuman,
  onFeedback,
}: ChatMessagesProps) {
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
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }
          ${index == 0 ? "mt-auto" : ""}
          `}
        >
          <ViewMessage
            message={message}
            onFeedback={(isPositive) =>
              onFeedback?.(Math.abs(-index + messages.length) - 1, isPositive)
            }
          />
        </div>
      ))}
      {isLoading && <Loader />}
      <div ref={messagesEndRef} />
    </div>
    // </div>
  );
}
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
const Loader = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-[var(--card-background)] rounded-lg p-4 shadow-sm border border-[var(--card-border)]">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
};
