import { tool } from "@openai/agents";
import { z } from "zod";

export const getWeatherTool = tool({
  name: "get_weather",
  description: "Get the weather for a given city",
  parameters: z.object({
    demo: z.string(),
  }),
  execute: async (input) => {
    return `The weather in ${input.demo} is sunny`;
  },
});
