import { createClient } from "edgedb";

type Conversation = {
  conversation_id: string;
  created_at: string;
  updated_at: string;
  conversation_message_count: number;
};

export async function GET() {
  const client = createClient();

  try {
    const conversations = await client.query<Conversation>(
      `
      select Conversation {
        conversation_id,
        created_at,
        updated_at,
        conversation_message_count,
      } filter exists .conversation_messages order by .updated_at desc
      `
    );

    return Response.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response("Failed to fetch conversations", { status: 500 });
  }
}
