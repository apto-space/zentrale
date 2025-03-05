import { createClient } from "edgedb";

type Conversation = {
  id: string;
  created_at: string;
  conversation_message_count: number;
};

export async function GET() {
  const client = createClient();

  try {
    const conversations = await client.query<Conversation>(
      `
      select Conversation {
        id,
        created_at,
        conversation_message_count,
      } filter exists .conversation_messages order by .created_at desc
      `
    );

    return Response.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response("Failed to fetch conversations", { status: 500 });
  }
}
