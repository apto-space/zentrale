"use client";
import { useEffect, useState } from "react";

interface ConversationTitleProps {
  conversationId: string;
  initialTitle?: string;
}

export function ConversationTitle({
  conversationId,
  initialTitle,
}: ConversationTitleProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!title && !isLoading) {
      generateTitle();
    }
  }, [title, isLoading]);

  const generateTitle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/core/api/conversations/${conversationId}/title`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to generate title");
      }
      const data = await response.json();
      setTitle(data.title);
    } catch (error) {
      console.error("Error generating title:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-sm text-[var(--text-secondary)] animate-pulse">
        Generating title...
      </div>
    );
  }

  if (!title) {
    return (
      <div className="text-sm text-[var(--text-secondary)]">
        Untitled conversation
      </div>
    );
  }

  return (
    <div className="text-sm font-medium text-[var(--text-primary)]">
      {title}
    </div>
  );
}
