import { useState } from "react";
import { ToolRenderer } from "../core/tools/ToolRenderer";
import { ChatMessage, Feedback, MessagePart } from "./ChatMessages";
import MarkdownContent from "./MarkdownContent";

export function ViewMessage({
  message,
  onFeedback,
}: {
  message: ChatMessage;
  onFeedback?: (isPositive: boolean) => void;
}) {
  const [feedback, setFeedback] = useState<Feedback | null>(
    message.feedback ?? null
  );

  const handleFeedback = (isPositive: boolean) => {
    if (feedback?.is_positive === isPositive) {
      setFeedback(null);
      onFeedback?.(isPositive);
    } else {
      setFeedback({
        is_positive: isPositive,
        feedback_text: message.feedback?.feedback_text,
      });
      onFeedback?.(isPositive);
    }
  };

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
                onClick={() => handleFeedback(true)}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  feedback?.is_positive === true
                    ? "bg-black"
                    : "text-[var(--text-secondary)]"
                }`}
                title="Yes"
              >
                👍
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  feedback?.is_positive === false
                    ? "bg-black"
                    : "text-[var(--text-secondary)]"
                }`}
                title="No"
              >
                👎
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
