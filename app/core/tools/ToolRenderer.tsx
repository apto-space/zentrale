import React from "react";
import {
  WeatherToolView,
  weatherToolSchema,
  WEATHER_TOOL_NAME,
  type WeatherToolResult,
} from "./weather";
import {
  SearchToolView,
  searchToolSchema,
  SEARCH_TOOL_NAME,
  type SearchToolResult,
} from "./search";

export type ToolInvocation = {
  state: "result";
  step: number;
  toolCallId: string;
  toolName: string;
  args: unknown;
  result: unknown;
};

type ToolRendererProps = {
  toolInvocation: ToolInvocation;
};

export function ToolRenderer({ toolInvocation }: ToolRendererProps) {
  const { toolName, result } = toolInvocation;

  switch (toolName) {
    case WEATHER_TOOL_NAME: {
      const parseResult = weatherToolSchema.safeParse(result);
      if (!parseResult.success) {
        return (
          <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
            <div className="text-red-500 mb-2">Validation Error:</div>
            <pre className="text-sm overflow-auto mb-2">
              {JSON.stringify(parseResult.error, null, 2)}
            </pre>
            <div className="text-sm text-[var(--text-secondary)]">
              Raw data:
            </div>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(toolInvocation, null, 2)}
            </pre>
          </div>
        );
      }
      return <WeatherToolView result={parseResult.data} />;
    }
    case SEARCH_TOOL_NAME: {
      const parseResult = searchToolSchema.safeParse(result);
      if (!parseResult.success) {
        return (
          <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
            <div className="text-red-500 mb-2">Validation Error:</div>
            <pre className="text-sm overflow-auto mb-2">
              {JSON.stringify(parseResult.error, null, 2)}
            </pre>
            <div className="text-sm text-[var(--text-secondary)]">
              Raw data:
            </div>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(toolInvocation, null, 2)}
            </pre>
          </div>
        );
      }
      return <SearchToolView result={parseResult.data} />;
    }
    default:
      return (
        <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--card-border)]">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      );
  }
}
