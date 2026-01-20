import "dotenv/config";
import { initLogger } from "braintrust";
import { OpenAIAgentsTraceProcessor } from "@braintrust/openai-agents";
import { Agent, run, user, withTrace, addTraceProcessor } from "@openai/agents";
import type { AgentInputItem } from "@openai/agents";
import { ask, autoMode } from "./utils/ask";
import { basicAgent } from "./agents/basicAgent";

const logger = initLogger({
  projectName: "OpenAI Agents Braintrust Exploration",
});

// Add the processor to OpenAI Agents
const processor = new OpenAIAgentsTraceProcessor({ logger });
addTraceProcessor(processor);

let history: AgentInputItem[] = [];
let latestAgent: Agent = basicAgent;

async function main() {
  console.log("Type exit() to leave");
  await withTrace("Chat Session", async () => {
    while (true) {
      const message = await ask("> ", "What is the weather in Tokyo?");
      if (message === "exit()") {
        return;
      }
      history.push(user(message));
      const result = await run(latestAgent, history);

      console.log(`[${latestAgent.name}] ${result.finalOutput}`);

      if (result.lastAgent) {
        latestAgent = result.lastAgent;
      }
      history = result.history;
      if (autoMode) return; // single turn in auto mode
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
