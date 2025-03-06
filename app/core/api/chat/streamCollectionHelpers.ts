// import { Message } from "@ai-sdk/react";

type StreamEvent = {
  type: string;
  value: any;
};

type ToolInvocation = {
  state: "result";
  step: number;
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  result: Record<string, any>;
};

type MessagePart = {
  type: "text" | "tool-invocation";
  text?: string;
  toolInvocation?: ToolInvocation;
};

export type CollectedMessage = {
  parts: MessagePart[];
  toolInvocations: ToolInvocation[];
  content: string;
  //   revisionId?: string;
  //   createdAt?: string;
};

export function collectStreamEvents(events: StreamEvent[]): CollectedMessage {
  let currentText = "";
  let currentToolCall: ToolInvocation | null = null;
  const parts: MessagePart[] = [];
  const toolInvocations: ToolInvocation[] = [];

  for (const event of events) {
    switch (event.type) {
      case "text":
        currentText += event.value;
        break;

      case "tool_call":
        // If we have accumulated text, add it as a part
        if (currentText) {
          parts.push({
            type: "text",
            text: currentText,
          });
          currentText = "";
        }

        // Start a new tool call
        currentToolCall = {
          state: "result",
          step: 0,
          toolCallId: event.value.toolCallId,
          toolName: event.value.toolName,
          args: event.value.args,
          result: {}, // Will be filled when we get the result
        };
        break;

      case "tool_result":
        if (currentToolCall) {
          currentToolCall.result = event.value.result;
          parts.push({
            type: "tool-invocation",
            toolInvocation: currentToolCall,
          });
          toolInvocations.push(currentToolCall);
          currentToolCall = null;
        }
        break;

      case "finish_message":
        // Add any remaining text as a part
        if (currentText) {
          parts.push({
            type: "text",
            text: currentText,
          });
        }
        break;
    }
  }

  // Combine all text parts into the final content
  const content = parts
    .filter(
      (part): part is MessagePart & { type: "text" } => part.type === "text"
    )
    .map((part) => part.text)
    .join("");

  return {
    // id: events[0]?.value?.messageId || "",
    // role: "assistant",
    content,
    parts,
    toolInvocations,
    // createdAt: "2025-03-06T17:43:18.495Z",
    // revisionId: "ydBWBP2vQusilMF8",
  };
}
