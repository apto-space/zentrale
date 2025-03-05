"use client";
import { useEffect, useState } from "react";
import { ConversationList } from "./ConversationList";
import { useRouter } from "next/navigation";

type Conversation = {
  id: string;
  created_at: string;
  conversation_message_count: number;
};

export const ConversationSidebar = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchConversations = async () => {
    try {
      const response = await fetch("/core/api/conversations");
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch conversations"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/core/api/conversations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      // If we're deleting the current conversation, redirect to home
      const currentConversationId = new URL(
        window.location.href
      ).searchParams.get("conversationId");
      if (currentConversationId === id) {
        router.push("/");
      }

      // Refresh the conversations list
      fetchConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  // Hide the sidebar if there are no conversations and no error
  if (!isLoading && !error && conversations.length === 0) {
    return null;
  }

  if (error) {
    return (
      <div className="w-64 border-r border-gray-200 h-full p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-64 border-r border-gray-200 h-full p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2 mb-4">
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ConversationList conversations={conversations} onDelete={handleDelete} />
  );
};
