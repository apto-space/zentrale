"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { ChatPage } from "./ChatPage";
import { ConversationSidebar } from "./ConversationSidebar";

export const ChatPageWrapper = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversationId, setConversationId] = useState<string>(() => v4());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const urlConversationId = searchParams.get("conversationId");

    if (!urlConversationId) {
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
    <div className="h-screen flex">
      <ConversationSidebar refreshKey={refreshKey} />
      <ChatPage
        key={conversationId}
        conversationId={conversationId}
        onConversationUpdate={handleConversationUpdate}
      />
    </div>
  );
};
