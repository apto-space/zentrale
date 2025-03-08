import { ChatInput } from "./ChatInput";

type EmptyStateProps = {
  onQuestionClick: (question: string) => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
};

export const EmptyState = ({
  onQuestionClick,
  input,
  handleInputChange,
  handleSubmit,
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
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-1">
          Welcome to the Chat!
        </h1>
        <p className="text-[var(--text-secondary)]">
          I'm here to help you with any questions you might have.
        </p>
      </div>

      <div className="w-full max-w-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(query)}
              className="p-4 text-left rounded-2xl border border-gray-200 cursor-pointer hover:transition-none hover:bg-gray-50 transition-colors text-[var(--text-primary)]"
            >
              {query}
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
        />
      </div>
    </div>
  );
};
