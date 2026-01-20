import { createAgent } from "./agentBuilder.js";

const agentName = "Math Tutor";
const agentInstructions =
  "You provide help with math problems. Explain your reasoning at each step and include examples";

export const mathTutorAgent = createAgent(agentName, agentInstructions);
