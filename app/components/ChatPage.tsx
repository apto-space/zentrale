"use client";
import { ChatMessages, ChatMessage } from "./ChatMessages";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar, OpenButton } from "./ConversationSidebar";
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
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    append,
    stop,
    reload,
  } = useConversationChatV2(conversationId, onConversationUpdate);
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
      <div className="fixed top-0 left-0 w-full   z-10 flex">
        <div className=" flex-1">
          <OpenButton />
        </div>
        <div className="  w-full grow justify-center max-w-4xl">
          {messages.length > 0 && (
            <div className="p-4 border-[var(--card-border)]">
              <h1 className="text-lg font-medium">
                You are talking to Jon Bot
              </h1>
            </div>
          )}
        </div>
        <div className=" flex-1"></div>
      </div>
      <div className="top-0 left-0 w-full   z-10 flex opacity-0">
        <div className=" flex-1">
          <OpenButton />
        </div>
        <div className="  w-full grow justify-center max-w-4xl">
          {messages.length > 0 && (
            <div className="p-4 border-[var(--card-border)]">
              <h1 className="text-lg font-medium">
                You are talking to Jon Bot
              </h1>
            </div>
          )}
        </div>
        <div className=" flex-1"></div>
      </div>
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
            status={status}
            onFeedback={handleFeedback}
            onRequestHuman={onRequestHuman}
            onReload={
              status === "ready" || status === "error" ? reload : undefined
            }
          />
          <div className="p-4 flex justify-end">
            {status === "streaming" && (
              <button
                onClick={stop}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Stop
              </button>
            )}
          </div>
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
