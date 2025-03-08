"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { ChatPage } from "./ChatPage";
import { ConversationSidebar } from "./ConversationSidebar";
import { ChatAppConfig } from "../core/ChatAppConfig";
import { defaultConfig } from "../core/api/chat/aiConfig";

type ChatPageWrapperProps = {
  config?: ChatAppConfig;
};

export const ChatPageWrapper = ({
  config = defaultConfig,
}: ChatPageWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const urlConversationId = searchParams.get("conversationId");

    if (!urlConversationId) {
      // we don't set it in useState because we want to avoid re-rendering and overfetching
      const newId = v4();
      setConversationId(newId);
      const newParams = new URLSearchParams(searchParams);
      newParams.set("conversationId", newId);
      router.push(`?${newParams.toString()}`, { scroll: false });
    } else {
      setConversationId(urlConversationId);
    }
  }, [searchParams]);

  if (!conversationId) {
    return null; // or a loading state
  }

  const handleConversationUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col items-center">
      <ConversationSidebar refreshKey={refreshKey} />
      <div className="flex-1 flex justify-center h-screen max-w-4xl w-full">
        <ChatPage
          key={conversationId}
          conversationId={conversationId}
          onConversationUpdate={handleConversationUpdate}
          config={config}
        />
      </div>
    </div>
  );
};
