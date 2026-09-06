export type Role = "user" | "assistant" | "system" | "tool";

export interface Message {
  id: string;
  role: Role;
  content: string;
  audioUrl?: string;
  isStreaming?: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: string;
}

export type AssistantState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "executing";
