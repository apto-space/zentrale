import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { z } from "zod";
import { processStreamAndSaveResponse, upsertConversation } from "./dbHelpers";
import { weatherToolSchema } from "./WeatherTool";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  const conversationId = url.searchParams.get("conversationId");

  if (!conversationId) {
    return new Response("Conversation ID is required", { status: 400 });
  }

  if (!sessionId) {
    return new Response("Session ID is required", { status: 400 });
  }

  try {
    const nextMessage = messages[0];

    // Create or get conversation
    const conversation = await upsertConversation({
      sessionId,
      conversationId,
      nextMessage,
    });

    const result = streamText({
      model: anthropic("claude-3-5-haiku-latest"),
      system: "You are a helpful assistant.",
      messages,
      tools: {
        weather: tool({
          description: "Get the weather in a location",
          parameters: weatherToolSchema,
          execute: async ({ location }) => ({
            location,
            temperature: 72 + Math.floor(Math.random() * 21) - 10,
          }),
        }),
      },
    });

    // Create a TransformStream to collect the assistant's message while streaming
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // Process the stream in the background
    (async () => {
      try {
        const stream = result.toDataStream();
        if (!stream) return;
        await processStreamAndSaveResponse({
          stream,
          writer,
          conversation,
        });
      } catch (error) {
        console.error("Error processing stream:", error);
        await writer.abort(error);
      }
    })();

    // Return the readable stream to the client
    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      {
        status:
          error instanceof Error && error.message.includes("not found")
            ? 404
            : 500,
      }
    );
  }
}
// goal
// return format
// warning
// context dump
