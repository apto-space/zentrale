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
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to the Chat!
        </h1>
        <p className="text-gray-600">
          I'm here to help you with any questions you might have.
        </p>
      </div>

      <div className="w-full max-w-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(query)}
              className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
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
