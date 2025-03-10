import { createClient } from "edgedb";

type DBMessage = {
  content: string;
  role: string;
  id: string;
  parts: any[];
  tool_invocations: any[];
  feedback?: {
    is_positive: boolean;
    feedback_text?: string;
  };
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversation_id: string }> }
) {
  const client = createClient();

  try {
    const messages = await client.query<DBMessage>(
      `select Message {
        content := .message_content,
        role := .message_role,
        id,
        parts := .message_parts,
        tool_invocations := .message_tool_invocations,
        feedback := .message_feedback {
          is_positive,
          feedback_text,
        }
      } filter .message_conversation.conversation_id = <uuid>$conversation_id
      order by .created_at asc
      `,
      {
        conversation_id: (await params).conversation_id,
      }
    );

    return Response.json(
      messages.map((m) => ({
        ...m,
        content: (() => {
          try {
            return JSON.parse(m.content);
          } catch {
            return m.content;
          }
        })(),
      }))
    );
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return new Response("Failed to fetch conversation messages", {
      status: 500,
    });
  }
}
