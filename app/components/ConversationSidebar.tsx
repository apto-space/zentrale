"use client";
import { useEffect, useState } from "react";
import { ConversationList } from "./ConversationList";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";

type Conversation = {
  id: string;
  created_at: string;
  conversation_message_count: number;
};

export const ConversationSidebar = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Fetch conversations initially and when URL changes
  useEffect(() => {
    fetchConversations();
  }, []);

  // Watch for new conversations being created
  useEffect(() => {
    const conversationId = searchParams.get("conversationId");
    const isFresh = searchParams.get("fresh");

    // If we have a conversation ID but no fresh flag, refresh the list
    if (conversationId && !isFresh) {
      fetchConversations();
    }
  }, [searchParams]);

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

      // Close sidebar on mobile after deletion
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarContent = () => {
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }

    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2 mb-4">
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <ConversationList
        conversations={conversations}
        onDelete={handleDelete}
        onSelect={() => setIsOpen(false)}
      />
    );
  };

  // Hide the sidebar completely if there are no conversations and no error
  if (!isLoading && !error && conversations.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-2 rounded-lg bg-[var(--card-background)] shadow-md md:hidden z-50 border border-[var(--card-border)]"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 bg-[var(--card-background)] w-64 border-r border-[var(--card-border)] h-full overflow-y-auto`}
      >
        <div className="p-4">{sidebarContent()}</div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
