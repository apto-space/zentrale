import { Tool } from "ai";
import { z, ZodSchema } from "zod";

export type ToolConfig<Params = any, Results = any> = {
  aiTool: Tool<ZodSchema<Params>, Results>;
  view: React.ComponentType<{ result: Results; params: Params }>;
  outputSchema: z.ZodSchema<Results>;
  inputSchema: z.ZodSchema<Params>;
};
