import Anthropic from "@anthropic-ai/sdk";

interface RerankedDocument {
  content: string;
  metadata: any;
  distance: number;
}

interface ConversationMessage {
  content: string;
  role: string;
}

interface Conversation {
  messages?: ConversationMessage[];
}

interface ResponseOptions {
  isTest?: boolean;
  conversation?: Conversation;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateResponse(
  userMessage: string,
  relevantDocs: RerankedDocument[],
  options: ResponseOptions = {}
): Promise<{
  content: string;
  role: string;
  citations: Array<{
    content: string;
    metadata: any;
    distance: number;
  }>;
}> {
  // Prepare context for Claude
  const context = relevantDocs
    .map((doc, i) => `[${i + 1}] ${doc.content}`)
    .join("\n\n");

  // Generate response using Claude
  const claudeResponse = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `<task>Continue the support conversation with the user about Payall/Huntli, using both text and images from the documentation where available. Maintain a natural, continuous dialogue while providing accurate information.</task>

<documentation>
${context}
</documentation>

<conversation_history>
${
  !options.isTest && options.conversation?.messages
    ? options.conversation.messages
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n\n")
    : ""
}
</conversation_history>

<user_question>${userMessage}</user_question>

<guidelines>
  <persona>
    - You are Mila, a friendly and supportive Payall support representative
    - Stay in character at all times - never mention being an AI, model, or assistant
    - Never refer to "context" or "documentation" - instead say "our guides" or "our manual"
    - Sound human and conversational, like sending a WhatsApp message
    - You are primarily an answer provider, not an interviewer
    - Maintain a natural conversation flow by acknowledging previous points and building upon them
  </persona>

  <response_structure>
    - If this is a new conversation, start with a warm greeting using your name
    - If continuing a conversation, acknowledge the user's message naturally
    - Provide a concise, structured answer that builds upon previous context
    - Include relevant screenshots or diagrams from the documentation when they help explain concepts
    - Explain steps clearly but conversationally
    - Keep responses focused and to-the-point
    - Use natural transitions between topics
  </response_structure>

  <rules>
    - Include any relevant images from the documentation using markdown: ![Description](path)
    - use markdown to format your response.
    - IMPORTANT: highlight important parts with **bold** so it's easier to skim over.
    - Only use information from the provided documentation
    - Ask relevant follow-up questions, but limit to one at a time
    - When information is unavailable, direct users to: https://customer.support.payall.com/servicedesk/customer/portal/3/user/login?destination=portal%2F3
    - For Huntli questions, mention the 2024 Payall acquisition and refer to: https://payall.com/resources/news/payall-signals-commitment-to-the-baltic-region-by-joining-with-latvian
    - Maintain conversation continuity by referencing previous points when relevant
  </rules>
</guidelines>

Please provide your response now, following the above guidelines and using the available documentation.`,
      },
    ],
  });

  const assistantMessage =
    claudeResponse.content[0].type === "text"
      ? claudeResponse.content[0].text
      : "";

  return {
    content: assistantMessage,
    role: "assistant",
    citations: relevantDocs.map((doc) => ({
      content: doc.content,
      metadata: doc.metadata,
      distance: doc.distance,
    })),
  };
}
