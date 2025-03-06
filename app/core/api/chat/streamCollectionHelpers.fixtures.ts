import { CollectedMessage } from "./streamCollectionHelpers";

export const output: CollectedMessage = {
  // id: "msg-gUsCZBprHshxxlc8pTGgbf0j",
  // createdAt: "2025-03-06T17:59:08.699Z",
  // role: "assistant",
  content: "I'll check the weather for San Francisco right away.",
  parts: [
    {
      type: "text",
      text: "I'll check the weather for San Francisco right away.",
    },
    {
      type: "tool-invocation",
      toolInvocation: {
        state: "result",
        step: 0,
        toolCallId: "toolu_01Thb6KBTLrLcW6Yzgi7F32k",
        toolName: "weather",
        args: {
          location: "San Francisco",
        },
        result: {
          location: "San Francisco",
          temperature: 68,
        },
      },
    },
  ],
  toolInvocations: [
    {
      state: "result",
      step: 0,
      toolCallId: "toolu_01Thb6KBTLrLcW6Yzgi7F32k",
      toolName: "weather",
      args: {
        location: "San Francisco",
      },
      result: {
        location: "San Francisco",
        temperature: 68,
      },
    },
  ],
  // revisionId: "JESakV6765b4169o",
};
export const input = [
  {
    type: "start_step",
    value: { messageId: "msg-gUsCZBprHshxxlc8pTGgbf0j" },
  },
  { type: "text", value: "I" },
  { type: "text", value: "'ll check the weather for San Francisco" },
  { type: "text", value: " right away." },
  {
    type: "tool_call",
    value: {
      toolCallId: "toolu_01Thb6KBTLrLcW6Yzgi7F32k",
      toolName: "weather",
      args: { location: "San Francisco" },
    },
  },
  {
    type: "tool_result",
    value: {
      toolCallId: "toolu_01Thb6KBTLrLcW6Yzgi7F32k",
      result: { location: "San Francisco", temperature: 68 },
    },
  },
  {
    type: "finish_step",
    value: {
      finishReason: "tool-calls",
      isContinued: false,
      usage: { promptTokens: 502, completionTokens: 64 },
    },
  },
  {
    type: "finish_message",
    value: {
      finishReason: "tool-calls",
      usage: { promptTokens: 502, completionTokens: 64 },
    },
  },
];
