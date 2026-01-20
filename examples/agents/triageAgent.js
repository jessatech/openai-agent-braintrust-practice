import { createAgent } from "./agentBuilder.js";
import { historyTutorAgent } from "./historyTutorAgent.js";
import { mathTutorAgent } from "./mathTutorAgent.js";

const agentName = "Triage Agent";
const agentInstructions =
  "You determine which agent to use based on the user's homework question";
const tools = [];
const handoffs = [historyTutorAgent, mathTutorAgent];

export const triageAgent = createAgent(
  agentName,
  agentInstructions,
  tools,
  handoffs,
);
