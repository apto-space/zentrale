"use client";

import { useState, useEffect } from "react";
import type { SearchToolResult } from "../../core/tools/search/Schema";
import MarkdownContent from "~/app/components/MarkdownContent";

type SearchQuery = {
  id: string;
  example: string;
  keywords: string[];
  limit: number;
  relevanceThreshold: number;
};

type StoredQuery = SearchQuery & {
  timestamp: number;
};

type SearchResponse = {
  id: string;
  query: string;
  result: SearchToolResult;
};

export default function SearchDebugPage() {
  const [storedQueries, setStoredQueries] = useState<StoredQuery[]>([]);
  const [activeQueries, setActiveQueries] = useState<SearchQuery[]>([]);
  const [results, setResults] = useState<SearchResponse[]>([]);
  const [loadingQueries, setLoadingQueries] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("debug_search_queries");
    if (saved) {
      setStoredQueries(JSON.parse(saved));
    }
  }, []);

  const addNewQuery = () => {
    const newQuery = {
      id: crypto.randomUUID(),
      example: "",
      keywords: [],
      limit: 10,
      relevanceThreshold: 0.2,
      timestamp: Date.now(),
    };
    setStoredQueries([newQuery, ...storedQueries]);
    setActiveQueries([...activeQueries, newQuery]);
    localStorage.setItem(
      "debug_search_queries",
      JSON.stringify([newQuery, ...storedQueries])
    );
  };

  const updateQuery = (id: string, updates: Partial<SearchQuery>) => {
    const updatedQueries = storedQueries.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    setStoredQueries(updatedQueries);
    setActiveQueries(
      activeQueries.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
    localStorage.setItem(
      "debug_search_queries",
      JSON.stringify(updatedQueries)
    );
  };

  const removeQuery = (id: string) => {
    setActiveQueries(activeQueries.filter((q) => q.id !== id));
    setResults(results.filter((r) => r.id !== id));
  };

  const loadQuery = (stored: StoredQuery) => {
    if (!activeQueries.find((q) => q.id === stored.id)) {
      setActiveQueries([...activeQueries, stored]);
    }
  };

  const runSingleQuery = async (query: SearchQuery) => {
    setLoadingQueries(new Set([...loadingQueries, query.id]));
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queries: [query] }),
      });

      if (!response.ok) throw new Error("Search request failed");

      const data = await response.json();
      setResults((prev) => {
        const filtered = prev.filter((r) => r.id !== query.id);
        return [...filtered, data.results[0]];
      });
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Check console for details.");
    } finally {
      setLoadingQueries(
        new Set([...loadingQueries].filter((id) => id !== query.id))
      );
    }
  };

  const runAllQueries = async () => {
    if (activeQueries.length === 0) return;

    const queryIds = new Set(activeQueries.map((q) => q.id));
    setLoadingQueries(queryIds);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queries: activeQueries }),
      });

      if (!response.ok) throw new Error("Search request failed");

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Check console for details.");
    } finally {
      setLoadingQueries(new Set());
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Search Debug Tool</h1>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Active Queries</h2>
          <button
            onClick={addNewQuery}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Query
          </button>
        </div>

        {activeQueries.map((query) => (
          <div key={query.id} className="p-4 border rounded space-y-3">
            <div className="flex justify-between">
              <h3 className="font-medium">
                Query #{activeQueries.indexOf(query) + 1}
              </h3>
              <button
                onClick={() => removeQuery(query.id)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Query By Example
              </label>
              <textarea
                value={query.example}
                onChange={(e) =>
                  updateQuery(query.id, { example: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={2}
              />
              <label className="block text-sm font-medium mb-1">Keywords</label>
              <textarea
                value={query.keywords.join(", ")}
                onChange={(e) =>
                  updateQuery(query.id, {
                    keywords: e.target.value.split(","),
                  })
                }
                className="w-full p-2 border rounded"
                rows={2}
              />
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Limit</label>
                <input
                  type="number"
                  value={query.limit}
                  onChange={(e) =>
                    updateQuery(query.id, { limit: Number(e.target.value) })
                  }
                  className="w-24 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Threshold
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={query.relevanceThreshold}
                  onChange={(e) =>
                    updateQuery(query.id, {
                      relevanceThreshold: Number(e.target.value),
                    })
                  }
                  className="w-24 p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => runSingleQuery(query)}
                disabled={loadingQueries.has(query.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loadingQueries.has(query.id) ? "Searching..." : "Run Query"}
              </button>
            </div>
          </div>
        ))}

        {activeQueries.length > 1 && (
          <button
            onClick={runAllQueries}
            disabled={loadingQueries.size > 0}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loadingQueries.size > 0 ? "Searching..." : "Run All Queries"}
          </button>
        )}
      </div>

      {storedQueries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">All Queries</h2>
          <div className="grid grid-cols-2 gap-2">
            {storedQueries.map((q) => (
              <div
                key={q.id}
                onClick={() => loadQuery(q)}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                  activeQueries.some((aq) => aq.id === q.id)
                    ? "border-blue-500"
                    : ""
                }`}
              >
                <div className="font-medium truncate">{q.example}</div>

                <div className="text-sm text-gray-500">
                  Limit: {q.limit}, Threshold: {q.relevanceThreshold}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-8">
          {results.map((searchResponse) => {
            const query = activeQueries.find((q) => q.id === searchResponse.id);
            if (!query) return null;

            return (
              <div key={searchResponse.id} className="border-t pt-8">
                <h2 className="text-xl font-semibold mb-2">
                  Results for Query #{activeQueries.indexOf(query) + 1}
                </h2>
                <div className="text-sm text-gray-500 mb-2">
                  Query: {query.example}
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  {searchResponse.result.summary}
                </div>
                <div className="space-y-4">
                  {searchResponse.result.documents.map((doc, i) => (
                    <div key={i} className="p-4 border rounded">
                      <div className="font-medium mb-2">
                        {doc.metadata.header}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">
                        <MarkdownContent content={doc.content} />
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Distance: {doc.distance.toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
