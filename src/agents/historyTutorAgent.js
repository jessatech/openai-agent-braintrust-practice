import { createAgent } from "./agentBuilder.js";
import { historyFunFact } from "../tools/historyFunFact.js";

const agentName = "History Tutor";
const agentInstructions =
  "You provide assistance with historical queries. Explain important events and context clearly.";

export const historyTutorAgent = createAgent(agentName, agentInstructions, [
  historyFunFact,
]);
