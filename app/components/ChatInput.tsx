import TextareaAutosize from "react-textarea-autosize";
import { Send } from "lucide-react";

type ChatInputProps = {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  placeholder?: string;
};

export const ChatInput = ({
  input,
  handleInputChange,
  handleSubmit,
  placeholder = "Type your message here...",
}: ChatInputProps) => {
  return (
    <div className="flex items-end gap-2 p-4 border-t">
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
        placeholder={placeholder}
        className="flex-1 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={!input.trim()}
        className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};
