import { createInterface } from "node:readline/promises";

export const autoMode = process.env.EXAMPLES_INTERACTIVE_MODE === "auto";

export async function ask(prompt: string, fallback: string) {
  if (autoMode) return fallback;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const message = await rl.question(prompt);
  rl.close();
  return message;
}
