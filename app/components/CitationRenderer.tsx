import { useState } from "react";
import MarkdownContent from "./MarkdownContent";

interface Citation {
  content: string;
  metadata: any;
  distance?: number;
}

interface CitationRendererProps {
  citations: Citation[];
  messageIndex: number;
  className?: string;
}

export default function CitationRenderer({
  citations,
  messageIndex,
  className = "",
}: CitationRendererProps) {
  const [expandedCitations, setExpandedCitations] = useState<Set<number>>(
    new Set()
  );

  const toggleCitation = (citationIndex: number) => {
    const newExpanded = new Set(expandedCitations);
    if (newExpanded.has(citationIndex)) {
      newExpanded.delete(citationIndex);
    } else {
      newExpanded.add(citationIndex);
    }
    setExpandedCitations(newExpanded);
  };

  if (citations.length === 0) return null;

  return (
    <div className={`mt-4 space-y-2 ${className}`}>
      <h4 className="text-sm font-semibold">Sources:</h4>
      {citations.map((citation, citationIndex) => (
        <div key={citationIndex} className="text-sm bg-white/10 rounded p-2">
          <button
            onClick={() => toggleCitation(citationIndex)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {citation.content.trim().split("\n")[0]}
              </span>
              {citation.distance !== undefined && (
                <span className="text-xs opacity-75">
                  Relevance: {(1 - citation.distance).toFixed(2)}
                </span>
              )}
            </div>
          </button>
          {expandedCitations.has(citationIndex) && (
            <div className="mt-2 text-xs">
              <MarkdownContent content={citation.content} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
