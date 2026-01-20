import { Agent } from "@openai/agents";
import { weatherAgent } from "./weatherAgent";

export const basicAgent = new Agent({
  name: "Basic test agent",
  instructions: "You are a basic agent",
  handoffDescription: "An expert on everything but the weather.",
  handoffs: [weatherAgent],
});

// Set up circular handoff so weatherAgent can hand off back to basicAgent
weatherAgent.handoffs.push(basicAgent);
