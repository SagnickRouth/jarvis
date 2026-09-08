import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { JARVIS_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { getJarvisTools } from "@/lib/composio";

export const runtime = "nodejs";
export const maxDuration = 60;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Load Composio tools (Gmail / GitHub / Calendar). Empty {} if not configured.
  const tools = await getJarvisTools();

  const result = streamText({
    model: openrouter(process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-4"),
    system: JARVIS_SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools,
    // Allow the model to call a tool, read the result, and respond — up to 5 hops.
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
