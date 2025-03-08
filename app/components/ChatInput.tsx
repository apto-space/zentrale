import TextareaAutosize from "react-textarea-autosize";
import { Send } from "lucide-react";

type ChatInputProps = {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  placeholder?: string;
};
const SendIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 10 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.54323 0.294249C9.12316 -0.0931636 9.968 0.323749 9.9052 1.07781L9.88688 1.29773C9.60744 4.65308 9.01641 7.97718 8.12101 11.2297C7.90776 12.0043 6.83603 12.0711 6.51066 11.3531L5.16346 8.38039C5.03467 8.0962 4.72195 7.91378 4.38259 7.95013L1.04953 8.30707C0.284472 8.38901 -0.256194 7.45488 0.356929 6.86297C2.81812 4.48692 5.49519 2.33044 8.35563 0.419569L8.54323 0.294249Z"
        fill="white"
      />
    </svg>
  );
};

export const ChatInput = ({
  input,
  handleInputChange,
  handleSubmit,
  placeholder = "Type your message...",
}: ChatInputProps) => {
  return (
    <div className="flex items-end gap-2 p-4">
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
        className=" flex-1 p-4 rounded-4xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none bg-gray-50 text-[var(--text-primary)] placeholder-gray-400"
      />
      <button
        onClick={handleSubmit}
        className=" p-4 rounded-full hover:bg-black/80 bg-black text-white disabled:opacity-50 transition-colors cursor-pointer h-[56px] w-[56px] flex items-center justify-center"
      >
        <SendIcon />
      </button>
    </div>
  );
};
