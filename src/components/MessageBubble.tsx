"use client";

import { motion } from "framer-motion";
import type { Message } from "@/types";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md"
            : "rounded-bl-md"
        }`}
        style={{
          background: isUser ? "var(--jarvis-accent2)" : "var(--jarvis-panel)",
          color: isUser ? "#ffffff" : "var(--jarvis-text)",
          border: isUser ? "none" : "1px solid rgba(0,212,255,0.15)",
        }}
      >
        {message.content || (
          <span className="opacity-50 animate-pulse">Thinking...</span>
        )}
        {message.isStreaming && (
          <span className="inline-block w-1.5 h-4 ml-1 animate-pulse rounded-sm" style={{ background: "var(--jarvis-accent)" }} />
        )}
      </div>
    </motion.div>
  );
}
