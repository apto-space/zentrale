"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Plus } from "lucide-react";

type Conversation = {
  id: string;
  created_at: string;
  conversation_message_count: number;
};

type ConversationListProps = {
  conversations: Conversation[];
  onDelete: (id: string) => void;
};

export const ConversationList = ({
  conversations,
  onDelete,
}: ConversationListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentConversationId = searchParams.get("conversationId");

  const handleNewChat = () => {
    router.push("/");
  };

  return (
    <div className="w-64 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full mb-4 p-2 flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Conversations
        </h2>
        <div className="space-y-2">
          {conversations.map((conv) => (
            <div key={conv.id} className="group relative">
              <button
                onClick={() => router.push(`?conversationId=${conv.id}`)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentConversationId === conv.id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50 border-gray-200"
                } border`}
              >
                <div className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(conv.created_at), {
                    addSuffix: true,
                  })}
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {conv.conversation_message_count} messages
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
