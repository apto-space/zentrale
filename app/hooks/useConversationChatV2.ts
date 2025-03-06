// hook to be used in the chat page
import { useChat } from "@ai-sdk/react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 } from "uuid";
import { useAnonSession } from "./useAnonSession";
import { useEffect } from "react";

export const useConversationChatV2 = () => {
  const { id: sessionId } = useAnonSession();
  const searchParams = useSearchParams();
  // conversation ID either comes from search params or is generated
  const conversationId = searchParams.get("conversationId") ?? v4();
  const router = useRouter();

  const chat = useChat({
    api: `core/api/chat?sessionId=${sessionId}${
      conversationId ? `&conversationId=${conversationId}` : ""
    }`,
    id: conversationId,
  });
  useEffect(() => {
    const loadConversation = async () => {
      const urlConversationId = searchParams.get("conversationId");
      //   if (isFresh) {
      //     console.log("removing fresh status", isFresh);
      //     setIsFresh(false);
      //     return;
      //   }

      // on every url change, clear the conversation and stop
      //   console.log("loading conversation", urlConversationId);
      //   if (!isFresh) {
      //     chat.stop();
      //     console.log("clearing");
      //     setConversationId(null);
      //     if (!conversationId) {
      //       setTimeout(() => {
      //         chat.setMessages([]);
      //       }, 50);
      //       return;
      //     }
      //   }
      if (!urlConversationId) {
        console.log("no conversation id");
        return;
      }
      if (chat.messages.length > 0) {
        return;
      }
      console.log("loading conversation", urlConversationId);

      try {
        const response = await fetch(
          `/core/api/conversations/${urlConversationId}/messages`
        );
        if (!response.ok) {
          throw new Error("Failed to load conversation");
        }
        const messages = await response.json();
        chat.setMessages(messages);
        // setConversationId(urlConversationId);
      } catch (error) {
        console.error("Error loading conversation:", error);
        router.replace("/core", { scroll: false });
      }
    };

    loadConversation();
  }, [searchParams]);

  useEffect(() => {
    if (chat.messages.length === 1) {
      const newParams = new URLSearchParams(searchParams);
      // console.log("redirecting to", newConversationId);
      // newParams.set("conversationId", newConversationId);
      // setIsFresh(true);
      router.push(`?${newParams.toString()}`, {
        scroll: false,
      });
    }
  }, [chat.messages.length]);

  return chat;
};
