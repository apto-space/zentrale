import { anthropic } from "@ai-sdk/anthropic";
import {
  parseAssistantStreamPart,
  parseDataStreamPart,
  streamText,
  tool,
} from "ai";
import { createClient } from "edgedb";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create EdgeDB client
const client = createClient();

type Conversation = {
  conversation_id: string;
  conversation_anon_user_id: string;
};

type Message = {
  content: string;
  role: string;
};

type StreamProcessParams = {
  stream: ReadableStream;
  writer: WritableStreamDefaultWriter;
  conversation: Conversation;
};

async function upsertConversation({
  sessionId,
  conversationId,
  nextMessage,
}: {
  sessionId: string;
  conversationId: string;
  nextMessage: Message;
}): Promise<Conversation> {
  const newConversation = await client.querySingle<Conversation>(
    `
    with
      new_conv := (
        insert Conversation {
          conversation_anon_user_id := <str>$session_id,
          conversation_id := <uuid>$conversation_id,
        }
       unless conflict on (.conversation_id) else Conversation),
      # Insert the first message immediately to ensure no conversation exists without messages
      first_msg := (
        insert Message {
          message_conversation := new_conv,
          message_content := <str>$content,
          message_role := <str>$role,
        }
      )
    select new_conv {
      conversation_id,
      conversation_anon_user_id,
    }
    `,
    {
      session_id: sessionId,
      content: JSON.stringify(nextMessage.content),
      role: nextMessage.role,
      conversation_id: conversationId,
    }
  );

  if (!newConversation) {
    throw new Error("Failed to create conversation");
  }

  return newConversation;
}

async function saveRemainingMessages(
  conversationId: string,
  messages: Message[]
): Promise<void> {
  for (const message of messages) {
    await client.query(
      `
      insert Message {
        message_conversation := (select Conversation filter .conversation_id = <uuid>$conversation_id),
        message_content := <str>$content,
        message_role := <str>$role,
      }
      `,
      {
        conversation_id: conversationId,
        content: message.content,
        role: message.role,
      }
    );
  }
}

async function processStreamAndSaveResponse({
  stream,
  writer,
  conversation,
}: StreamProcessParams): Promise<void> {
  const encoder = new TextEncoder();
  let assistantMessage = "";

  try {
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the chunk and process it
      const chunk = new TextDecoder().decode(value);

      // Forward the chunk to the client
      await writer.write(encoder.encode(chunk));
      const parsed = parseDataStreamPart(chunk);
      console.log("parsed", parsed);
      if (parsed.type === "text") {
        assistantMessage += parsed.value;
      }
      // Only accumulate content from message chunks (starting with '0:')
      // const messageMatch = chunk.match(/^0:"([^"]+)"/);
      // if (messageMatch) {
      //   assistantMessage += messageMatch[1];
      // }
    }

    // Save the complete message once streaming is done
    console.log("assistantMessage", assistantMessage);
    if (assistantMessage) {
      await client.query(
        `
        insert Message {
          message_conversation := (select Conversation filter .conversation_id = <uuid>$conversation_id),
          message_content := <str>$content,
          message_role := <str>$role,
        }
        `,
        {
          conversation_id: conversation.conversation_id,
          content: JSON.stringify(assistantMessage.replaceAll("\\\\", `\\`)),
          role: "assistant",
        }
      );
    }

    await writer.close();
  } catch (error) {
    await writer.abort(error);
    throw error;
  }
}

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
          parameters: z.object({
            location: z
              .string()
              .describe("The location to get the weather for"),
          }),
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
