"use client";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { ConversationTitle } from "./ConversationTitle";

type ConversationChipViewProps = {
  conversationId: string;
  updatedAt: string;
  messageCount: number;
  title?: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

export const ConversationChipView = ({
  conversationId,
  updatedAt,
  messageCount,
  title,
  isSelected,
  onSelect,
  onDelete,
}: ConversationChipViewProps) => {
  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={`text-left p-3 w-full rounded-lg transition-colors cursor-pointer bg-white dark:bg-gray-800 ${
          isSelected
            ? "bg-orange-50 dark:bg-orange-900/50"
            : "hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        <div className="flex items-center gap-2">
          {isSelected && <div className="w-2 h-2 rounded-full bg-orange-500" />}
          <ConversationTitle
            conversationId={conversationId}
            initialTitle={title}
          />
        </div>
        <div className="text-sm text-[var(--text-secondary)] mt-1">
          {formatDistanceToNow(new Date(updatedAt), {
            addSuffix: true,
          })}
          {" • "}
          {messageCount} messages
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
