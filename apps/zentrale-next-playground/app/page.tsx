import { ChatPageInner } from "@zentrale/ui/components/ChatPage";
import { useTestConversation } from "@zentrale/ui/hooks/useConversationChat";

export default function Home() {
  const testConversation = useTestConversation();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ChatPageInner chat={testConversation} />
    </div>
  );
}
