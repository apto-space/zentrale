"use client";
import React, { useState } from "react";
import { SearchToolResult, SearchToolParams } from "./Schema";

export function SearchToolView({
  result,
  params,
}: {
  result: SearchToolResult;
  params: SearchToolParams;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--card-border)]">
      <div
        className="p-1.5 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1.5">
          <div className="text-lg">📚</div>
          <div className="text-sm text-[var(--text-secondary)]">
            {result.documents.length} sources found
          </div>
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          {isExpanded ? "▼" : "▶"}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t p-3 space-y-3 max-h-[500px] overflow-auto">
          {JSON.stringify(params)}
          <div>
            <div className="text-sm font-medium mb-1">Summary</div>
            <div className="text-sm text-[var(--text-secondary)]">
              {result.summary}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Documents</div>
            <div className="space-y-2">
              {result.documents.map((doc, i) => (
                <div key={i} className="text-sm border rounded p-2">
                  <div className="font-medium text-[var(--text-secondary)] mb-1">
                    {doc.metadata.header}
                  </div>
                  <div className="text-[var(--text-secondary)] text-xs mb-1">
                    Distance: {doc.distance.toFixed(4)}
                  </div>
                  <div className="text-[var(--text-secondary)] whitespace-pre-wrap overflow-hidden text-ellipsis">
                    {doc.content.length > 200
                      ? `${doc.content.slice(0, 200)}...`
                      : doc.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
