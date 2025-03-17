// import { toolConfig } from "./index";
import { type ToolConfig } from "./ToolConfig";
// Validation Error:

import { weatherTool } from "./weather";
// import { searchTool } from "./search";
// import { tomatoFactSearchTool } from "./tomatoFacts";

export const toolConfig = { ...weatherTool };
// for AI
export const tools = Object.fromEntries(
  Object.entries(toolConfig).map(([key, value]) => [key, value.aiTool])
);
export type ToolInvocation = {
  state: "result" | "call";
  step: number;
  toolCallId: string;
  toolName: keyof typeof toolConfig;
  args: unknown;
  result?: unknown;
};

type ToolRendererProps = {
  toolInvocation: ToolInvocation;
};

export function ToolRenderer({ toolInvocation }: ToolRendererProps) {
  const { toolName, result, state, args } = toolInvocation;
  const tool: ToolConfig = toolConfig[toolName];

  if (!tool) {
    return (
      <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
        <pre className="text-sm overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  }

  if (state === "call") {
    const parseArgs = tool.inputSchema.safeParse(args);
    if (!parseArgs.success) {
      return (
        <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
          <div className="text-red-500 mb-2">Input Validation Error:</div>
          <pre className="text-sm overflow-auto mb-2">
            {JSON.stringify(parseArgs.error, null, 2)}
          </pre>
          <div className="text-sm text-[var(--text-secondary)]">Raw args:</div>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
      );
    }
    return (
      <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  const parseResult = tool.outputSchema.safeParse(result);
  const parseArgs = tool.inputSchema.safeParse(args);
  if (!parseResult.success) {
    return (
      <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
        <div className="text-red-500 mb-2">Validation Error:</div>
        <pre className="text-sm overflow-auto mb-2">
          {JSON.stringify(parseResult.error, null, 2)}
        </pre>
        <div className="text-sm text-[var(--text-secondary)]">Raw data:</div>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(toolInvocation, null, 2)}
        </pre>
      </div>
    );
  }
  if (!parseArgs.success) {
    return (
      <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
        <div className="text-red-500 mb-2">Input Validation Error:</div>
        <pre className="text-sm overflow-auto mb-2">
          {JSON.stringify(parseArgs.error, null, 2)}
        </pre>
        <div className="text-sm text-[var(--text-secondary)]">Raw args:</div>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(args, null, 2)}
        </pre>
      </div>
    );
  }

  const View = tool.view;
  return <View result={parseResult.data} params={parseArgs.data} />;
}
