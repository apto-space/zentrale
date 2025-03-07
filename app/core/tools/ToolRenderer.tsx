import React from "react";
import { toolConfig } from "./index";
import { ToolConfig } from "./ToolConfig";

export type ToolInvocation = {
  state: "result";
  step: number;
  toolCallId: string;
  toolName: keyof typeof toolConfig;
  args: unknown;
  result: unknown;
};

type ToolRendererProps = {
  toolInvocation: ToolInvocation;
};

export function ToolRenderer({ toolInvocation }: ToolRendererProps) {
  const { toolName, result } = toolInvocation;
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

  const parseResult = tool.outputSchema.safeParse(result);
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

  const View = tool.view;
  return <View result={parseResult.data} />;
}
