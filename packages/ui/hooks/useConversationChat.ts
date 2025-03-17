// hook to be used in the chat page
import { useChat } from "@ai-sdk/react";
import { useAnonSession } from "./useAnonSession";
import { useEffect, useRef, useState } from "react";
import { type Message } from "@ai-sdk/react";

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

export const useConversationChat = (
  conversationId: string,
  onStreamComplete?: () => void
) => {
  const { id: sessionId } = useAnonSession();
  const handleFeedback = async (messageOffset: number, isPositive: boolean) => {
    // Optimistically update UI

    try {
      const response = await fetch("/core/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageOffset, isPositive, conversationId }),
      });

      if (!response.ok) {
        // Revert on error
        throw new Error("Failed to save feedback");
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      // You might want to show a toast notification here
    }
  };

  const chat = useChat({
    api: `core/api/chat?sessionId=${sessionId}&conversationId=${conversationId}`,
    id: conversationId,
    onResponse: (response) => {
      onStreamComplete?.();
    },
    onFinish: () => {
      onStreamComplete?.();
    },
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load conversation history when component mounts
  useEffect(() => {
    const loadConversation = async () => {
      if (chat.messages.length > 0) {
        return;
      }

      try {
        const response = await fetch(
          `/core/api/conversations/${conversationId}/messages`
        );
        if (!response.ok) {
          throw new Error("Failed to load conversation");
        }
        const messages = await response.json();
        chat.setMessages(messages);
        setMessages(messages);
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
    };

    loadConversation();
  }, [conversationId]);

  return {
    ...chat,
    handleFeedback,
    messages: chat.messages.map((message) => ({
      ...message,
      feedback: messages.find((f) => f.id === message.id)?.feedback!,
    })),
  };
};
