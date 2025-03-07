"use client";
import ChatMessages, { Message } from "./ChatMessages";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./ConversationSidebar";
import { useConversationChatV2 } from "../hooks/useConversationChatV2";
import { useState, useEffect } from "react";

// next steps
// decoding conversations
// navigating fixes (fresh (replacestate))

interface ChatPageProps {
  conversationId: string;
  onConversationUpdate?: () => void;
  onRequestHuman?: () => void;
}

export const ChatPage = ({
  conversationId,
  onConversationUpdate,
  onRequestHuman,
}: ChatPageProps) => {
  const { messages, input, handleInputChange, handleSubmit, status, append } =
    useConversationChatV2(conversationId, onConversationUpdate);
  const [feedbackState, setFeedbackState] = useState<Record<string, boolean>>(
    {}
  );
  const lastMessage = messages[messages.length - 1];
  console.log("lastMessage", lastMessage);

  // Initialize feedback state from messages
  useEffect(() => {
    const initialFeedback: Record<string, boolean> = {};
    (messages as Message[]).forEach((message) => {
      if (message.feedback?.is_positive !== undefined) {
        initialFeedback[message.id] = message.feedback.is_positive;
      }
    });
    setFeedbackState(initialFeedback);
  }, [messages]);

  const handleQuestionClick = (question: string) => {
    // Set the input value to the clicked question
    append({
      role: "user",
      content: question,
    });
  };

  const handleFeedback = async (messageId: string, isPositive: boolean) => {
    // Optimistically update UI
    setFeedbackState((prev) => ({ ...prev, [messageId]: isPositive }));

    try {
      const response = await fetch("/core/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId, isPositive }),
      });

      if (!response.ok) {
        // Revert on error
        setFeedbackState((prev) => {
          const newState = { ...prev };
          delete newState[messageId];
          return newState;
        });
        throw new Error("Failed to save feedback");
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      // You might want to show a toast notification here
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {messages.length === 0 ? (
        <EmptyState
          onQuestionClick={handleQuestionClick}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <>
          <ChatMessages
            messages={messages as Message[]}
            isLoading={status == "streaming"}
            onFeedback={handleFeedback}
            onRequestHuman={onRequestHuman}
            feedbackState={feedbackState}
          />
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
};
