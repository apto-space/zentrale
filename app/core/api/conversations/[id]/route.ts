import { createClient } from "edgedb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = createClient();

  try {
    await client.query(
      `
      with
        target := (select Conversation filter .id = <uuid>$conversation_id),
        # Delete all messages first due to the constraint
        del_msgs := (delete Message filter .message_conversation = target)
      delete target
      `,
      {
        conversation_id: params.id,
      }
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return new Response("Failed to delete conversation", { status: 500 });
  }
}
