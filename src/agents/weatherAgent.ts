import { Agent } from "@openai/agents";
import { getWeatherTool } from "../tools/getWeatherTool";

export const weatherAgent = new Agent({
  name: "Weather Agent",
  handoffDescription: "Knows everything about the weather but nothing else.",
  tools: [getWeatherTool],
});
