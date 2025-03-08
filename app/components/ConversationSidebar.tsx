"use client";
import { useEffect, useState } from "react";
import { ConversationList } from "./ConversationList";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Conversation = {
  conversation_id: string;
  created_at: string;
  updated_at: string;
  conversation_message_count: number;
};

interface ConversationSidebarProps {
  refreshKey?: number;
}

const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await fetch("/core/api/conversations");
  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }
  const data = await response.json();
  return data.sort(
    (a: Conversation, b: Conversation) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
};

const deleteConversation = async (id: string): Promise<void> => {
  const response = await fetch(`/core/api/conversations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete conversation");
  }
};

export const ConversationSidebar = ({
  refreshKey,
}: ConversationSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: conversations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations", refreshKey],
    queryFn: fetchConversations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: (_, id) => {
      // If we're deleting the current conversation, redirect to home
      const currentConversationId = new URL(
        window.location.href
      ).searchParams.get("conversationId");
      if (currentConversationId === id) {
        router.push("/core");
      }
      // Invalidate and refetch conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      console.error("Error deleting conversation:", error);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarContent = () => {
    if (error instanceof Error) {
      return <div className="text-red-500">Error: {error.message}</div>;
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

  // Hide the sidebar if there are no conversations and no error
  if (!isLoading && !error && conversations.length === 0) {
    return null;
  }

  return (
    <>
      {/* Toggle button - only visible when sidebar is closed */}
      {!isOpen && (
        <button onClick={toggleSidebar} className="fixed top-4 left-4 p-2 z-50">
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 w-lg h-full max-w-full`}
      >
        <div className="h-full p-6">
          <div className="bg-stone-100 rounded-3xl p-6 overflow-y-auto max-h-min">
            {sidebarContent()}
          </div>
        </div>
      </div>

      {/* Overlay - now always visible when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
