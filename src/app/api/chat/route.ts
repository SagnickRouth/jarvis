import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export const runtime = "nodejs";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const SYSTEM_PROMPT = `You are JARVIS, Sagnick's personal AI assistant.
Be concise, direct, and proactive. Sagnick is a B.Tech CS student building AI systems.
When responding, keep answers clear and conversational — your responses will be
read aloud via TTS, so avoid markdown symbols, code blocks, and long bullet lists
in spoken replies. Use natural language.
For technical questions, be precise but accessible.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter(process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-4"),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toTextStreamResponse();
}
