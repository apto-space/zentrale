import { NextResponse } from "next/server";
import { createClient } from "gel";
import { z } from "zod";

const feedbackSchema = z.object({
  messageOffset: z.number(),
  isPositive: z.boolean(),
  conversationId: z.string(),
});

type MessageFeedback = {
  id: string;
  is_positive: boolean;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messageOffset, isPositive, conversationId } =
      feedbackSchema.parse(body);
    const client = createClient();

    // Get the message ID
    const messages = await client.query<{ id: string }>(
      `
      select Message { id, message_offset:= <int32>$messageOffset } filter .message_conversation.conversation_id = <uuid>$conversationId
      order by .created_at desc
      offset <int32>$messageOffset
      limit 1
      `,
      { messageOffset, conversationId }
    );
    console.log(messages);

    if (messages.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const messageId = messages[0].id;

    // First check if feedback exists for this message
    const existingFeedback = await client.query<MessageFeedback>(
      `
      select MessageFeedback {
        id,
        is_positive
      } filter .message.id = <uuid>$messageId
      `,
      { messageId }
    );

    if (existingFeedback.length > 0) {
      // If feedback exists and is the same type, remove it
      if (existingFeedback[0].is_positive === isPositive) {
        await client.query(
          `
          delete MessageFeedback filter .message.id = <uuid>$messageId
          `,
          { messageId }
        );
        return NextResponse.json({ success: true, removed: true });
      }
      // If feedback exists but is different type, update it
      await client.query(
        `
        update MessageFeedback filter .message.id = <uuid>$messageId
        set {
          is_positive := <bool>$isPositive,
        }
        `,
        { messageId, isPositive }
      );
    } else {
      // Create new feedback record
      await client.query(
        `
        insert MessageFeedback {
          message := (select Message filter .id = <uuid>$messageId),
          is_positive := <bool>$isPositive,
        }
        `,
        { messageId, isPositive }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
