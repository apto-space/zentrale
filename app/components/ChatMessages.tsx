import { useRef, useEffect } from "react";
import MarkdownContent from "./MarkdownContent";
import CitationRenderer from "./CitationRenderer";
import { Message } from "@ai-sdk/react";
import { ToolRenderer } from "../core/tools/ToolRenderer";

// interface Message {
//   content: string;
//   role: "user" | "assistant";
// }

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

type MessagePart = {
  type: "text" | "tool-invocation";
  text?: string;
  toolInvocation?: any;
};

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
              </div>
            )}
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
