"use client";

import { useState, useRef, useCallback } from "react";
import type { AssistantState } from "@/types";

interface InputBarProps {
  onSend: (text: string) => void;
  onStopSpeaking: () => void;
  state: AssistantState;
  setState: (s: AssistantState) => void;
}

export function InputBar({ onSend, onStopSpeaking, state, setState }: InputBarProps) {
  const [text, setText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || state === "thinking") return;
    onSend(text.trim());
    setText("");
  };

  const toggleMic = useCallback(() => {
    if (state === "speaking") {
      onStopSpeaking();
      return;
    }

    if (state === "listening") {
      recognitionRef.current?.stop();
      setState("idle");
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition not supported. Use Chrome or Edge.");
      return;
    }

    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      if (transcript.trim()) {
        onSend(transcript.trim());
      }
    };

    rec.onend = () => setState("idle");
    rec.onerror = () => setState("idle");

    rec.start();
    recognitionRef.current = rec;
    setState("listening");
  }, [state, onSend, onStopSpeaking, setState]);

  const micLabel = state === "listening" ? "⏹" : state === "speaking" ? "⏸" : "🎙️";

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full pb-4">
      <button
        type="button"
        onClick={toggleMic}
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all glow"
        style={{
          background: state === "listening" ? "#00ff88" : "var(--jarvis-panel)",
          border: "1px solid rgba(0,212,255,0.3)",
        }}
      >
        {micLabel}
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask JARVIS anything..."
        disabled={state === "thinking"}
        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: "var(--jarvis-panel)",
          border: "1px solid rgba(0,212,255,0.2)",
          color: "var(--jarvis-text)",
        }}
      />
      <button
        type="submit"
        disabled={!text.trim() || state === "thinking"}
        className="px-5 py-3 rounded-xl text-sm font-medium transition-all"
        style={{
          background: text.trim() ? "var(--jarvis-accent)" : "var(--jarvis-panel)",
          color: text.trim() ? "#000" : "var(--jarvis-muted)",
        }}
      >
        Send
      </button>
    </form>
  );
}
