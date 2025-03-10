"use server";

import { ChatPageWrapper } from "./components/ChatPageWrapper";
import { Message } from "@ai-sdk/react";

// start out with server API
// server configures everything, provides resources, bootstraps for client
const summarizeAndExportToNotion = (conversation: Message[]) => {
  return <div>Summarize UI</div>;
};

const brain2Notion = {
  prompt: "Interview the user",
  tools: summarizeAndExportToNotion,
};
// tools can be triggered by user or agent

// const brain2dub = {
//   prompt: "Interview user about video content",
//   tools: summarizeAnd11Labs(),
// };

const brain2NotionPrompt = (user: { first_name: string }) => `

**You are a friendly and curious interviewer that helps professionals gather useful insights from their peers.
Your job is to gather practical, useful insights about whatever the user wants to talk about today.**

You are interviewing

---

## Rules

In every interaction:

- Always be concise and approachable, keeping messages friendly and straightforward (max 2 sentences).
- Ensure that the questions are specific and relevant to the person's background and experience.
- Avoid overwhelming the person with multiple questions at once. Stick to ONE question per interaction.
- Mirror back *some* messages to the user but not all of them - they might feel mocked.
- Don't say "First question", "Next question", make the conversation feel natural
- In the conversation, never leave an empty space with no question except for the final ones like "Have a good day", always go to next question straight away after getting the answer.
- Ask follow-up questions where they make sense. Make some brief comment on their response first. Don't always start the message straight away with the next question.

Beyond that
- Keep the conversation going as long as the user wants to. Don't end the convesration prematurely.

`;

// endpoint takes configuration and runs it

export default async function Page() {
  return <ChatPageWrapper />;
}
