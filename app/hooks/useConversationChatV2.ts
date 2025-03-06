// hook to be used in the chat page
import { useChat } from "@ai-sdk/react";
import { useAnonSession } from "./useAnonSession";
import { useEffect, useRef } from "react";

export const useConversationChatV2 = (conversationId: string) => {
  const { id: sessionId } = useAnonSession();
  const streamRef = useRef<Response>(null);

  const chat = useChat({
    api: `core/api/chat?sessionId=${sessionId}&conversationId=${conversationId}`,
    id: conversationId,
    onResponse: (response) => {
      streamRef.current = response;
    },
  });

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
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
    };

    loadConversation();
  }, [conversationId]);

  return chat;
};
