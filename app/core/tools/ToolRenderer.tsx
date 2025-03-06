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
      const validatedResult = weatherToolSchema.parse(
        result
      ) as WeatherToolResult;
      return <WeatherToolView result={validatedResult} />;
    }
    case SEARCH_TOOL_NAME: {
      const validatedResult = searchToolSchema.parse(
        result
      ) as SearchToolResult;
      return <SearchToolView result={validatedResult} />;
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
