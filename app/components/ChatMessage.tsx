import { useState } from "react";
import { ToolRenderer } from "../core/tools/ToolRenderer";
import { ChatMessage, Feedback, MessagePart } from "./ChatMessages";
import MarkdownContent from "./MarkdownContent";
import { RotateCcw } from "lucide-react";

function UserMessage({ content }: { content: string }) {
  return (
    <div className="max-w-[80%] rounded-4xl p-4 bg-gray-50">
      <MarkdownContent content={content.trim()} />
    </div>
  );
}

function AssistantMessage({
  message,
  onFeedback,
  onReload,
  isLastMessage,
}: {
  message: ChatMessage;
  onFeedback?: (isPositive: boolean) => void;
  onReload?: () => void;
  isLastMessage?: boolean;
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
    <div className="max-w-[80%]">
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
        {(onFeedback || onReload) && (
          <div className="flex items-center gap-1 mt-1.5 text-sm">
            {onFeedback && (
              <>
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
              </>
            )}
            {onReload && isLastMessage && (
              <button
                onClick={onReload}
                className=" text-gray-400"
                title="Reload"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ViewMessage(props: {
  message: ChatMessage;
  onFeedback?: (isPositive: boolean) => void;
  onReload?: () => void;
  isLastMessage?: boolean;
}) {
  return props.message.role === "user" ? (
    <UserMessage content={props.message.content} />
  ) : (
    <AssistantMessage {...props} />
  );
}
