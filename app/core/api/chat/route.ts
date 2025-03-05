import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-3-5-haiku-latest"),
    system: "You are a helpful assistant.",
    messages,
  });

  const res = result.toDataStreamResponse();
}
// goal
// return format
// warning
// context dump
