import { createClient } from "edgedb";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

type Message = {
  message_content: string;
  message_role: string;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversation_id: string }> }
) {
  const { conversation_id } = await params;
  const client = createClient();

  try {
    // Get the first few messages to generate a title
    const messages = await client.query<Message>(
      `select Message {
        message_content,
        message_role,
      } filter .message_conversation.conversation_id = <uuid>$conversation_id
      order by .created_at asc
      limit 3`,
      { conversation_id }
    );

    // Create a prompt for title generation
    const prompt = `Based on this conversation, generate a short, descriptive title (max 60 characters). The title should capture the main topic or purpose of the conversation. Only respond with the title, nothing else.

Conversation:
${messages.map((m) => `${m.message_role}: ${m.message_content}`).join("\n")}`;

    // Generate title using the AI
    const result = await generateText({
      model: anthropic("claude-3-5-haiku-latest"),
      prompt,
      maxTokens: 60,
    });

    // Clean up the title
    const cleanTitle = result.text.trim().replace(/["']/g, "");
    const finalTitle =
      cleanTitle.length > 60 ? cleanTitle.substring(0, 57) + "..." : cleanTitle;

    // Update the conversation with the new title
    await client.query(
      `update Conversation filter .conversation_id = <uuid>$conversation_id
      set {
        conversation_title := <str>$title
      }`,
      { conversation_id, title: finalTitle }
    );

    return Response.json({ title: finalTitle });
  } catch (error) {
    console.error("Error generating title:", error);
    return new Response("Failed to generate title", { status: 500 });
  }
}
