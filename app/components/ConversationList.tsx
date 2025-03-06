"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Plus } from "lucide-react";

type Conversation = {
  conversation_id: string;
  created_at: string;
  updated_at: string;
  conversation_message_count: number;
};

type ConversationListProps = {
  conversations: Conversation[];
  onDelete: (id: string) => void;
  onSelect?: () => void;
};

export const ConversationList = ({
  conversations,
  onDelete,
  onSelect,
}: ConversationListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentConversationId = searchParams.get("conversationId");

  const handleNewChat = () => {
    router.push("/core");
    onSelect?.();
  };

  const handleConversationSelect = (id: string) => {
    router.push(`?conversationId=${id}`);
    onSelect?.();
  };

  return (
    <div className="box-border border-[var(--card-border)] h-full overflow-y-auto flex flex-col gap-2">
      <button
        onClick={handleNewChat}
        className="p-2 flex items-center justify-center gap-2 cursor-pointer text-[var(--text-primary)] hover:text-[var(--text-primary)] rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-primary)] hover:bg-[var(--hover-background)] transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Chat
      </button>

      <h2 className="text-lg font-semibold text-[var(--text-primary)] my-4">
        Conversations
      </h2>
      <div className="space-y-2">
        {conversations.map((conv) => (
          <div key={conv.conversation_id} className="group relative">
            <button
              onClick={() => handleConversationSelect(conv.conversation_id)}
              className={`text-left p-2 w-full rounded-lg transition-colors cursor-pointer ${
                currentConversationId === conv.conversation_id
                  ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]"
                  : "hover:bg-[var(--hover-background)] border-[var(--card-border)]"
              } border`}
            >
              <div className="text-sm text-[var(--text-secondary)]">
                {formatDistanceToNow(new Date(conv.updated_at), {
                  addSuffix: true,
                })}
              </div>
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {conv.conversation_message_count} messages
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.conversation_id);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
