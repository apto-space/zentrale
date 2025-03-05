import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { createClient } from "edgedb";
import test from "node:test";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create EdgeDB client
const client = createClient();

type Conversation = {
  id: string;
  conversation_anon_user_id: string;
};

export async function POST(req: Request) {
  const { messages } = await req.json();
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  const conversationId = url.searchParams.get("conversationId");

  if (!sessionId) {
    return new Response("Session ID is required", { status: 400 });
  }

  let conversation: Conversation;
  if (conversationId) {
    // Fetch existing conversation
    const existingConversation = await client.querySingle<Conversation>(
      `
      select Conversation {
        id,
        conversation_anon_user_id,
      } filter .id = <uuid>$conversation_id
      `,
      {
        conversation_id: conversationId,
      }
    );

    if (!existingConversation) {
      return new Response("Conversation not found", { status: 404 });
    }
    conversation = existingConversation;
  } else {
    // Create new conversation
    const newConversation = await client.querySingle<Conversation>(
      `
      insert Conversation {
        conversation_anon_user_id := <str>$session_id,
      }
      `,
      {
        session_id: sessionId,
      }
    );

    if (!newConversation) {
      return new Response("Failed to create conversation", { status: 500 });
    }
    conversation = newConversation;
  }

  // Save the initial messages
  for (const message of messages) {
    await client.query(
      `
      insert Message {
        message_conversation := (select Conversation filter .id = <uuid>$conversation_id),
        message_content := <json>$content,
        message_role := <str>$role,
      }
      `,
      {
        conversation_id: conversation.id,
        content: message.content,
        role: message.role,
      }
    );
  }

  const result = streamText({
    model: anthropic("claude-3-5-haiku-latest"),
    system: "You are a helpful assistant.",
    messages,
  });

  // Create a TransformStream to collect the assistant's message while streaming
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  let assistantMessage = "";

  // Process the stream in the background
  (async () => {
    try {
      // Send conversation ID at the start of the stream
      // const data = `f:{"messageId":"msg-xsXGld9wNINC9SOqHfzribCh"}`;
      // await writer.write(encoder.encode(data));
      // await writer.write(encoder.encode(data2));

      const stream = result.toDataStream();
      if (!stream) return;

      const reader = stream.getReader();
      const testChunk = `0:"<CONV_ID>${conversation.id}</CONV_ID_END>"
`;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append to message
        const chunk = new TextDecoder().decode(value);
        assistantMessage += chunk;
        if (chunk.includes("messageId")) {
          await writer.write(encoder.encode(chunk));
          await writer.write(encoder.encode(testChunk));
        } else {
          await writer.write(encoder.encode(chunk));
        }

        // Forward the chunk to the client
      }

      // Save the complete message once streaming is done
      await client.query(
        `
        insert Message {
          message_conversation := (select Conversation filter .id = <uuid>$conversation_id),
          message_content := <json>$content,
          message_role := <str>$role,
        }
      `,
        {
          conversation_id: conversation.id,
          content: assistantMessage,
          role: "assistant",
        }
      );

      await writer.close();
    } catch (error) {
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
}
// goal
// return format
// warning
// context dump
