import { useChat, Message } from "@ai-sdk/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "edgedb";
import { useAnonSession } from "./useAnonSession";

export const useConversationChat = () => {
  const { id: sessionId } = useAnonSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  // Load conversation messages when ID is present
  //   useEffect(() => {
  //     const loadConversation = async () => {
  //       const urlConversationId = searchParams.get("conversationId");
  //       const isFresh = searchParams.get("fresh") === "true";

  //       if (!urlConversationId || isFresh) {
  //         setConversationId(null);
  //         setInitialMessages([]);
  //         return;
  //       }

  //       try {
  //         const response = await fetch(
  //           `/core/api/conversations/${urlConversationId}/messages`
  //         );
  //         if (!response.ok) {
  //           throw new Error("Failed to load conversation");
  //         }
  //         const messages = await response.json();
  //         setInitialMessages(messages);
  //         setConversationId(urlConversationId);
  //       } catch (error) {
  //         console.error("Error loading conversation:", error);
  //         router.replace("/", { scroll: false });
  //       }
  //     };

  //     loadConversation();
  //   }, [searchParams]);

  const chat = useChat({
    api: `core/api/chat?sessionId=${sessionId}${
      conversationId ? `&conversationId=${conversationId}` : ""
    }`,
    initialMessages,
    onResponse: (response_) => {
      const response = response_.clone();
      const reader = response.body?.getReader();
      if (reader) {
        (async () => {
          const { value } = await reader.read();
          const text = new TextDecoder().decode(value);
          console.log(text);

          // Look for XML tags in the stream
          const match = text.match(/<CONV_ID>([^<]+)<\/CONV_ID>/);
          if (match) {
            const newConversationId = match[1];
            setConversationId(newConversationId);
            // Update URL without full page reload, remove fresh parameter if it exists
            const newParams = new URLSearchParams(searchParams);
            newParams.set("conversationId", newConversationId);
            newParams.set("fresh", "true");
            router.push(`?${newParams.toString()}`, {
              scroll: false,
            });
          }
        })();
      }
    },
  });

  // Filter out the XML tags from messages before rendering
  const messages = chat.messages.map((msg) => ({
    ...msg,
    content: msg.content.replace(/<CONV_ID>.*?<\/CONV_ID>/g, ""),
  }));

  return {
    ...chat,
    messages,
    conversationId,
  };
};
