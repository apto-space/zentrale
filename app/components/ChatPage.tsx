"use client";
import { useChat } from "@ai-sdk/react";
import ChatMessages from "./ChatMessages";
import { useAnonSession } from "../hooks/useAnonSession";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";

// next steps
// anon auth to keep history
// init DB

export const ChatPage = () => {
  const { id: sessionId } = useAnonSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string | null>(
    searchParams.get("conversationId")
  );

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: `core/api/chat?sessionId=${sessionId}${
      conversationId ? `&conversationId=${conversationId}` : ""
    }`,
    onResponse: (response_) => {
      const response = response_.clone();
      const reader = response.body?.getReader();
      if (reader) {
        (async () => {
          const { value } = await reader.read();
          const text = new TextDecoder().decode(value);
          console.log(text);

          // Look for XML tags in the stream
          const match = text.match(/<CONV_ID>([^<]+)<\/CONV_ID_END>/);
          if (match) {
            const newConversationId = match[1];
            setConversationId(newConversationId);
            // Update URL without full page reload
            router.push(`?conversationId=${newConversationId}`, {
              scroll: false,
            });
          }
        })();
      }
    },
  });

  // Filter out the XML tags from messages before rendering
  const filteredMessages = messages.map((msg) => ({
    ...msg,
    content: msg.content.replace(/<CONV_ID>.*?<\/CONV_ID_END>/g, ""),
  }));

  const handleQuestionClick = (question: string) => {
    // Set the input value to the clicked question
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    // Submit the question
    handleSubmit();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* <div className="bg-white border-b border-b-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16">
              <img
                src="/milencita.png"
                alt="Milena"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Milena</h1>
              <p className="text-gray-600">
                Here to make things easy for you! 👩‍💻🚀
              </p>
            </div>
          </div>
        </div> */}

      {messages.length === 0 ? (
        <EmptyState
          onQuestionClick={handleQuestionClick}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <>
          <ChatMessages
            messages={filteredMessages}
            isLoading={status == "streaming"}
          />
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </>
      )}
      {/* {messages.length === 0 ? (
          <EmptyState onQuestionClick={handleQuestionClick} />
        ) : (
        )} */}

      {/* <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border-t border-gray-200 px-6 py-4"
        >
          <div className="flex space-x-4 items-stretch">
            <textarea
              {...register("message")}
              className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-8 rounded-lg hover:bg-blue-600 disabled:opacity-50 whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </form> */}
    </div>
  );
};
