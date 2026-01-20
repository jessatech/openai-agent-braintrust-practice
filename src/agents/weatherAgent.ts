import { Agent } from "@openai/agents";
import { getWeatherTool } from "../tools/getWeatherTool";
import { searchLocationTool } from "../tools/searchLocationTool";

export const weatherAgent = new Agent({
  name: "Weather Agent",
  handoffDescription: "Knows everything about the weather but nothing else.",
  instructions:
    "You are a weather expert. When users ask about weather, use the search_location tool to find the exact location first if needed, then use get_weather to retrieve the forecast. Provide clear and helpful weather information.",
  tools: [searchLocationTool, getWeatherTool],
});
