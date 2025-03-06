// hook to be used in the chat page
import { useChat } from "@ai-sdk/react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 } from "uuid";
import { useAnonSession } from "./useAnonSession";
import { useEffect, useRef, useState } from "react";
import { url } from "inspector";

export const useConversationChatV2 = () => {
  const { id: sessionId } = useAnonSession();
  const searchParams = useSearchParams();
  // conversation ID either comes from search params or is generated
  const [randomId, setRandomId] = useState(() => v4());
  const urlConversationId = searchParams.get("conversationId");
  const conversationId = urlConversationId ?? randomId;
  const router = useRouter();

  const chat = useChat({
    api: `core/api/chat?sessionId=${sessionId}${
      conversationId ? `&conversationId=${conversationId}` : ""
    }`,
    id: conversationId,
    onResponse: (response) => {
      streamRef.current = response;
    },
  });

  // stop when the conversationId changes
  const [lastChat, setLastChat] = useState<typeof chat>(chat);
  useEffect(() => {
    chat.stop();
    console.log("l", lastChat.messages);
    if (chat.status === "streaming") {
      chat.setMessages((m) => m.slice(0, -1));
    }
    setLastChat(chat);
  }, [conversationId]);
  const streamRef = useRef<Response>(null);
  //   useEffect(() => {
  //     const lastMessage = messages[messages.length - 1];
  //     if (lastMessage.role === "user") {
  //       console.log("reloading", chat.messages.length);
  //       setTimeout(() => {
  //         chat.reload();
  //       }, 100);
  //     }

  //   }, [chat.status]);

  // load new content when the user navigates
  useEffect(() => {
    const loadConversation = async () => {
      if (!urlConversationId) {
        console.log("going home");
        const new_convo_id = v4();
        console.log("new_convo_id", new_convo_id);
        setRandomId(new_convo_id);
        return;
      }
      if (chat.messages.length > 0) {
        return;
      }
      console.log("loading conversation", conversationId);

      try {
        const response = await fetch(
          `/core/api/conversations/${conversationId}/messages`
        );
        if (!response.ok) {
          throw new Error("Failed to load conversation");
        }
        const messages = await response.json();
        chat.setMessages(messages);
        // setConversationId(conversationId);
      } catch (error) {
        console.error("Error loading conversation:", error);
        router.replace("/core", { scroll: false });
      }
    };

    loadConversation();
  }, [urlConversationId]);

  useEffect(() => {
    if (chat.messages.length === 1) {
      console.log("redirecting");
      const newParams = new URLSearchParams(searchParams);
      // console.log("redirecting to", newConversationId);
      newParams.set("conversationId", conversationId);
      // setIsFresh(true);
      router.push(`?${newParams.toString()}`, {
        scroll: false,
      });
    }
  }, [chat.messages.length]);

  return chat;
};
