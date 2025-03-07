import { NextResponse } from "next/server";
import { createClient } from "gel";
import { z } from "zod";

const feedbackSchema = z.object({
  messageId: z.string(),
  isPositive: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messageId, isPositive } = feedbackSchema.parse(body);

    const client = createClient();

    // Create feedback record
    await client.query(
      `
      insert MessageFeedback {
        message := (select Message filter .id = <uuid>$messageId),
        is_positive := <bool>$isPositive,
      }
    `,
      {
        messageId,
        isPositive,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
