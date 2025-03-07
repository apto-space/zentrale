"use client";
import ChatMessages, { ChatMessage } from "./ChatMessages";
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
  const lastMessage = messages[messages.length - 1];
  console.log("lastMessage", lastMessage);

  const handleQuestionClick = (question: string) => {
    // Set the input value to the clicked question
    append({
      role: "user",
      content: question,
    });
  };

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

  return (
    <div className="flex-1 flex flex-col">
      {messages.length > 0 && (
        <div className="p-4 border-[var(--card-border)]">
          <h1 className="text-lg font-medium">You are talking to Jon Bot</h1>
        </div>
      )}
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
            messages={messages}
            isLoading={status == "streaming"}
            onFeedback={handleFeedback}
            onRequestHuman={onRequestHuman}
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
