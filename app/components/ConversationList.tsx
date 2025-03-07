"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { Plus, ChevronLeft } from "lucide-react";
import { ConversationChipView } from "./ConversationChipView";

type Conversation = {
  conversation_id: string;
  created_at: string;
  updated_at: string;
  conversation_message_count: number;
  conversation_title?: string;
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

  // Group conversations by date
  const groupedConversations = conversations.reduce((acc, conv) => {
    const date = new Date(conv.updated_at);
    let group = "Previous";
    if (isToday(date)) group = "Today";
    else if (isYesterday(date)) group = "Yesterday";

    if (!acc[group]) acc[group] = [];
    acc[group].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={onSelect}
          className=" aspect-square p-3 flex items-center justify-center cursor-pointer text-[var(--text-secondary)] bg-white hover:bg-gray-50 rounded-full transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNewChat}
          className="flex-1 p-3 flex items-center justify-center gap-2 cursor-pointer text-white bg-black hover:bg-gray-900 rounded-full transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {Object.entries(groupedConversations).map(([group, convs]) => (
        <div key={group} className="space-y-2">
          <h2 className="text-sm font-medium text-[var(--text-secondary)] px-2">
            {group}
          </h2>
          <div className="space-y-2">
            {convs.map((conv) => (
              <ConversationChipView
                key={conv.conversation_id}
                conversationId={conv.conversation_id}
                updatedAt={conv.updated_at}
                messageCount={conv.conversation_message_count}
                title={conv.conversation_title}
                isSelected={currentConversationId === conv.conversation_id}
                onSelect={() => handleConversationSelect(conv.conversation_id)}
                onDelete={() => onDelete(conv.conversation_id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
