import { useRef, useEffect } from "react";
import MarkdownContent from "./MarkdownContent";
import CitationRenderer from "./CitationRenderer";
import { Message } from "@ai-sdk/react";

// interface Message {
//   content: string;
//   role: "user" | "assistant";
// }

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function ChatMessages({
  messages,
  isLoading = false,
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
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.role === "user"
                ? "bg-[var(--accent-primary)] text-white"
                : "bg-[var(--card-background)] text-[var(--text-primary)] shadow-sm border border-[var(--card-border)]"
            }`}
          >
            <MarkdownContent content={message.content} />
          </div>
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
