import { Tool } from "ai";
import { z } from "zod";

// Type for tool exports like { search: Tool }
export type ToolExport = { [key: string]: Tool };

export type ChatAppConfig = {
  /** Unique identifier for this chat application */
  id: string;

  /** The name shown in the header */
  name: string;

  /** System prompts that define the behavior */
  prompts: {
    /** The main system prompt that defines the assistant's behavior */
    system: string;
    /** Optional additional context provided to each conversation */
    context?: string;
  };

  /** Optional configuration */
  options?: {
    /** Tools available to this chat application. Each item should be a record with a single key mapping to a Tool */
    tools?: ToolExport[];

    /** Initial greeting message shown when starting a new chat */
    greeting?: string;

    /** Example queries shown in the empty state */
    examples?: string[];

    /** Model configuration */
    model?: {
      name: string;
      maxSteps?: number;
      maxRetries?: number;
    };
  };
};

// Schema for runtime validation
export const ChatAppConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  prompts: z.object({
    system: z.string(),
    context: z.string().optional(),
  }),
  options: z
    .object({
      tools: z.array(z.any()).optional(), // We could make this more specific if needed
      greeting: z.string().optional(),
      examples: z.array(z.string()).optional(),
      model: z
        .object({
          name: z.string(),
          maxSteps: z.number().optional(),
          maxRetries: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});
