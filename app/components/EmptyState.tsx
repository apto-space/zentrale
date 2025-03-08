import { ChatInput } from "./ChatInput";

type EmptyStateProps = {
  onQuestionClick: (question: string) => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  status?: "streaming" | "submitted" | "ready" | "error";
  onStop?: () => void;
};

export const EmptyState = ({
  onQuestionClick,
  input,
  handleInputChange,
  handleSubmit,
  status,
  onStop,
}: EmptyStateProps) => {
  const exampleQueries = [
    "What is the best way to learn programming?",
    "Can you help me debug my code?",
    "What are some good coding practices?",
    "How do I start a new project?",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center mb-12">
        <h1 className="text-lg md:text-4xl font-bold text-[var(--text-primary)] mb-1">
          Welcome to the Chat!
        </h1>
        <p className="text-[var(--text-secondary)]">
          I'm here to help you with any questions you might have.
        </p>
      </div>

      <div className="w-full max-w-2xl mb-8">
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(query)}
              className="flex cursor-pointer p-4 text-left rounded-2xl border border-gray-200 dark:border-gray-700 hover:transition-none hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[var(--text-primary)]"
            >
              <span>{query}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          placeholder="Type your message here..."
          status={status}
          onStop={onStop}
        />
      </div>
    </div>
  );
};
