"use client";
import { useChat } from "@ai-sdk/react";
import ChatMessages from "./ChatMessages";
import TextareaAutosize from "react-textarea-autosize";

// next steps
// anon auth to keep history
// init DB

export const ChatPage = () => {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "core/api/chat",
  });
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

      <ChatMessages messages={messages} isLoading={status == "streaming"} />
      <TextareaAutosize
        autoFocus
        onKeyDown={(ev) => {
          if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            handleSubmit();
          }
        }}
        onChange={handleInputChange}
        value={input}
      ></TextareaAutosize>
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
