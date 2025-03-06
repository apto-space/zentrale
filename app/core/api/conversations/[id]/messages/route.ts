import { createClient } from "edgedb";

type DBMessage = {
  content: string;
  role: string;
  id: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = createClient();

  try {
    const messages = await client.query<DBMessage>(
      `
      with conversation := (
        select Conversation filter .id = <uuid>$conversation_id
      )
      select Message {
        content := .message_content,
        role := .message_role,
        id,
      } filter .message_conversation = conversation
      order by .created_at asc
      `,
      {
        conversation_id: (await params).id,
      }
    );

    return Response.json(messages);
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return new Response("Failed to fetch conversation messages", {
      status: 500,
    });
  }
}
