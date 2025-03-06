import { describe, it, expect } from "bun:test";
import { collectStreamEvents } from "./streamCollectionHelpers";
import { input, output } from "./streamCollectionHelpers.fixtures";

describe("collectStreamEvents", () => {
  it("should collect text and tool events into a message", () => {
    const result = collectStreamEvents(input);
    expect(result).toEqual(output);
  });
});
