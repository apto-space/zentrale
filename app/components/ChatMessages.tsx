import { useRef, useEffect, useState } from "react";
import MarkdownContent from "./MarkdownContent";
import { Message } from "@ai-sdk/react";
import { ToolRenderer } from "../core/tools/ToolRenderer";

type ChatMessage = Message & {
  feedback?: Feedback;
};

type Feedback = {
  is_positive: boolean;
  feedback_text?: string;
};
interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onRequestHuman?: () => void;
  onFeedback?: (messageId: string, isPositive: boolean) => void;
}

type MessagePart = {
  type: "text" | "tool-invocation";
  text?: string;
  toolInvocation?: any;
};

function ViewMessage({
  message,
  onFeedback,
}: {
  message: ChatMessage;
  onFeedback?: (messageId: string, isPositive: boolean) => void;
}) {
  const [feedback, setFeedback] = useState<Feedback | null>(
    message.feedback ?? null
  );
  return (
    <div
      className={`max-w-[80%] rounded-lg p-4 ${
        message.role === "user"
          ? "bg-[var(--accent-primary)] text-white"
          : "bg-[var(--card-background)] text-[var(--text-primary)] shadow-sm border border-[var(--card-border)]"
      }`}
    >
      {message.role === "user" ? (
        <MarkdownContent content={message.content} />
      ) : (
        <div className="space-y-2">
          {(message.parts as MessagePart[])?.map((part, partIndex) => (
            <div key={partIndex}>
              {part.type === "text" ? (
                <MarkdownContent content={part.text || ""} />
              ) : part.type === "tool-invocation" ? (
                <ToolRenderer toolInvocation={part.toolInvocation} />
              ) : (
                <pre className="bg-[var(--background)] p-2 rounded overflow-x-auto text-sm">
                  {JSON.stringify(part, null, 2)}
                </pre>
              )}
            </div>
          ))}
          {onFeedback && (
            <div className="flex items-center gap-1 mt-1.5 text-sm">
              <span className="text-[var(--text-secondary)]">
                Was this helpful?
              </span>
              <button
                onClick={() => {
                  setFeedback({
                    is_positive: true,
                    feedback_text: message.feedback?.feedback_text,
                  });
                  onFeedback(message.id, true);
                }}
                className={`p-1 hover:bg-[var(--background)] rounded transition-colors ${
                  feedback?.is_positive === true
                    ? "text-green-500"
                    : "text-[var(--text-secondary)] hover:text-green-500"
                }`}
                title="Yes"
              >
                👍
              </button>
              <button
                onClick={() => {
                  setFeedback({
                    is_positive: false,
                    feedback_text: message.feedback?.feedback_text,
                  });
                  onFeedback(message.id, false);
                }}
                className={`p-1 hover:bg-[var(--background)] rounded transition-colors ${
                  feedback?.is_positive === false
                    ? "text-red-500"
                    : "text-[var(--text-secondary)] hover:text-red-500"
                }`}
                title="No"
              >
                👎
              </button>
            </div>
          )}
          {JSON.stringify(feedback)}
        </div>
      )}
    </div>
  );
}

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

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--background)]">
      {messages.length > 0 && onRequestHuman && (
        <div className="flex justify-center mb-4">
          <button
            onClick={onRequestHuman}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--card-border)] hover:bg-[var(--card-background)] transition-colors"
          >
            <span>👥</span>
            Talk to a Human
          </button>
        </div>
      )}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <ViewMessage message={message} onFeedback={onFeedback} />
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-[var(--card-background)] rounded-lg p-4 shadow-sm border border-[var(--card-border)]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce delay-200" />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
