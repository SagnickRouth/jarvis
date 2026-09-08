/**
 * Conversation memory — persists chat history to localStorage.
 * Client-side only. Keeps the last 50 messages.
 */
import type { UIMessage } from "ai";

const STORAGE_KEY = "jarvis:history";
const MAX_MESSAGES = 50;

export function loadHistory(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(messages: UIMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_MESSAGES))
    );
  } catch {
    // storage full or unavailable — ignore
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
