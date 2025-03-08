import { createClient } from "edgedb";
import { collectStreamEvents } from "./streamCollectionHelpers";
import { parseDataStreamPart } from "ai";

const client = createClient();

export type Conversation = {
  conversation_id: string;
  conversation_anon_user_id: string;
};

export type Message = {
  content: string;
  role: string;
};

export type StreamProcessParams = {
  stream: ReadableStream;
  writer: WritableStreamDefaultWriter;
  conversation: { conversation_id: string };
};

const insertMessageQuery = `
insert Message {
  message_conversation := (select Conversation filter .conversation_id = <uuid>$conversation_id),
  message_content := <str>$content,
  message_role := <str>$role,
  message_parts := <array<json>>$parts,
  message_tool_invocations := <array<json>>$tool_invocations,
}
`;

export async function upsertConversation({
  sessionId,
  conversationId,
  nextMessage,
}: {
  sessionId: string;
  conversationId: string;
  nextMessage: Message;
}): Promise<{ conversation_id: string }> {
  // ensure last message has not been saved yet
  const lastMessage = await client.querySingle<Message>(
    `select Message {content:= .message_content} filter .message_conversation.conversation_id = <uuid>$conversation_id order by .created_at desc limit 1`,
    {
      conversation_id: conversationId,
    }
  );
  console.log(lastMessage);
  if (JSON.parse(lastMessage?.content ?? "{}") == nextMessage.content) {
    return { conversation_id: conversationId };
  }

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
          message_parts := <array<json>>$parts,
          message_tool_invocations := <array<json>>$tool_invocations,
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
      parts: [],
      tool_invocations: [],
    }
  );

  if (!newConversation) {
    throw new Error("Failed to create conversation");
  }

  return newConversation;
}

export async function processStreamAndSaveResponse({
  stream,
  writer,
  conversation,
}: StreamProcessParams): Promise<void> {
  const encoder = new TextEncoder();
  const events: any[] = [];

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
      events.push(parsed);
    }

    // Collect the full message structure
    const collectedMessage = collectStreamEvents(events);

    // Save the complete message once streaming is done
    if (collectedMessage.content) {
      await client.query(insertMessageQuery, {
        conversation_id: conversation.conversation_id,
        content: collectedMessage.content,
        role: "assistant",
        parts: collectedMessage.parts,
        tool_invocations: collectedMessage.toolInvocations,
      });
    }

    await writer.close();
  } catch (error) {
    await writer.abort(error);
    throw error;
  }
}
