"use client";

import type { AssistantState } from "@/types";

const labels: Record<AssistantState, string> = {
  idle: "Ready",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
  executing: "Executing action...",
};

export function StatusIndicator({ state }: { state: AssistantState }) {
  return (
    <div className="text-xs tracking-widest uppercase mb-4 transition-colors duration-300"
      style={{ color: state === "idle" ? "var(--jarvis-muted)" : "var(--jarvis-accent)" }}>
      {labels[state]}
    </div>
  );
}
