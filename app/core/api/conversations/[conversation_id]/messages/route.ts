import { createClient } from "edgedb";

type DBMessage = {
  content: string;
  role: string;
  id: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversation_id: string }> }
) {
  const client = createClient();
  console.log("getting messages");

  try {
    const messages = await client.query<DBMessage>(
      `select Message {
        content := .message_content,
        role := .message_role,
        id,
      } filter .message_conversation.conversation_id = <uuid>$conversation_id
      order by .created_at asc
      `,
      {
        conversation_id: (await params).conversation_id,
      }
    );
    console.log("got messages", messages);

    return Response.json(messages);
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return new Response("Failed to fetch conversation messages", {
      status: 500,
    });
  }
}
