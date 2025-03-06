import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { createClient } from "edgedb";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create EdgeDB client
const client = createClient();

type Conversation = {
  id: string;
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
  isFresh: boolean;
};

async function getExistingConversation(
  conversationId: string
): Promise<Conversation> {
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
    throw new Error("Conversation not found");
  }

  return existingConversation;
}

async function createNewConversation(
  sessionId: string,
  firstMessage: Message
): Promise<Conversation> {
  const newConversation = await client.querySingle<Conversation>(
    `
    with
      new_conv := (
        insert Conversation {
          conversation_anon_user_id := <str>$session_id,
        }
      ),
      # Insert the first message immediately to ensure no conversation exists without messages
      first_msg := (
        insert Message {
          message_conversation := new_conv,
          message_content := <json>$content,
          message_role := <str>$role,
        }
      )
    select new_conv {
      id,
      conversation_anon_user_id,
    }
    `,
    {
      session_id: sessionId,
      content: firstMessage.content,
      role: firstMessage.role,
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
        message_conversation := (select Conversation filter .id = <uuid>$conversation_id),
        message_content := <json>$content,
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
  isFresh,
}: StreamProcessParams): Promise<void> {
  const encoder = new TextEncoder();
  let assistantMessage = "";

  try {
    const reader = stream.getReader();
    if (isFresh) {
      const convIdChunk = `0:"<CONV_ID>${conversation.id}</CONV_ID>"\n`;
      await writer.write(encoder.encode(convIdChunk));
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the chunk and process it
      const chunk = new TextDecoder().decode(value);

      // Forward the chunk to the client
      await writer.write(encoder.encode(chunk));

      // Only accumulate content from message chunks (starting with '0:')
      const messageMatch = chunk.match(/^0:"([^"]+)"/);
      if (messageMatch) {
        assistantMessage += messageMatch[1];
      }
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
    throw error;
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  const conversationId = url.searchParams.get("conversationId");

  if (!sessionId) {
    return new Response("Session ID is required", { status: 400 });
  }

  try {
    let conversation: Conversation;
    const isFresh = !conversationId;

    if (conversationId) {
      // Fetch existing conversation
      conversation = await getExistingConversation(conversationId);
    } else {
      // Create new conversation with its first message
      const firstMessage = messages[0];
      conversation = await createNewConversation(sessionId, firstMessage);
      // Save any remaining messages
      await saveRemainingMessages(conversation.id, messages.slice(1));
    }

    const result = streamText({
      model: anthropic("claude-3-5-haiku-latest"),
      system: "You are a helpful assistant.",
      messages,
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
          isFresh,
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
