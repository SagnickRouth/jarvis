/**
 * Composio client — server-side ONLY.
 * Holds OAuth access to Gmail / GitHub / Google Calendar.
 * NEVER import this into client components.
 */
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

const apiKey = process.env.COMPOSIO_API_KEY;
const userId = process.env.COMPOSIO_USER_ID || "default";

// Toolkits JARVIS is allowed to use.
export const JARVIS_TOOLKITS = ["gmail", "github", "googlecalendar"];

let _composio: Composio | null = null;

function getComposio(): Composio {
  if (!apiKey) {
    throw new Error(
      "COMPOSIO_API_KEY is not set. Add it to .env.local to enable tool calling."
    );
  }
  if (!_composio) {
    _composio = new Composio({
      apiKey,
      provider: new VercelProvider(),
    });
  }
  return _composio;
}

/**
 * Fetch the Vercel-AI-SDK-compatible tool set for the configured toolkits.
 * Pass the returned object directly into streamText({ tools }).
 *
 * If Composio isn't configured, returns an empty tool set so the chat
 * still works for plain conversation.
 */
export async function getJarvisTools() {
  if (!apiKey) {
    console.warn("[composio] No COMPOSIO_API_KEY — tool calling disabled.");
    return {};
  }
  try {
    const composio = getComposio();
    const tools = await composio.tools.get(userId, {
      toolkits: JARVIS_TOOLKITS,
    });
    return tools;
  } catch (err) {
    console.error("[composio] Failed to load tools:", err);
    return {};
  }
}
