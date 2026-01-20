import "dotenv/config";
import { run } from "@openai/agents";
import { triageAgent } from "./agents/triageAgent.js";
import { getInput } from "./utils/readLine.js";

async function main() {
  const userInput = await getInput("What would you like help with? ");
  const result = await run(triageAgent, userInput);
  console.log(result.finalOutput);
}

main().catch((err) => console.error(err));
