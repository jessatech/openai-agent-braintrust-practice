import { Agent } from "@openai/agents";

export function createAgent(
  name,
  instructions,
  tools = [],
  handoffs = [],
  model = "gpt-5-nano",
) {
  return new Agent({
    name: name,
    instructions: instructions,
    tools: tools,
    handoffs: handoffs,
    model: model,
  });
}
