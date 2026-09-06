"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Orb } from "@/components/Orb";
import { ChatWindow } from "@/components/ChatWindow";
import { InputBar } from "@/components/InputBar";
import { StatusIndicator } from "@/components/StatusIndicator";
import type { Message, AssistantState } from "@/types";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<AssistantState>("idle");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Send message to LLM ──
  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };

      const assistantId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setState("thinking");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map(({ role, content }) => ({
              role,
              content,
            })),
          }),
        });

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: full } : m
            )
          );
        }

        // Mark streaming complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );

        // Auto-speak the response
        if (autoSpeak && full.trim()) {
          setState("speaking");
          try {
            const ttsRes = await fetch("/api/tts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: full }),
            });
            const blob = await ttsRes.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.onended = () => {
              URL.revokeObjectURL(url);
              setState("idle");
            };
            await audio.play();
          } catch {
            setState("idle");
          }
        } else {
          setState("idle");
        }
      } catch (err) {
        console.error("Chat error:", err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Error connecting to JARVIS.", isStreaming: false }
              : m
          )
        );
        setState("idle");
      }
    },
    [messages, autoSpeak]
  );

  // ── Stop speaking ──
  const stopSpeaking = useCallback(() => {
    audioRef.current?.pause();
    setState("idle");
  }, []);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full pt-4 pb-2">
        <h1 className="text-xl font-bold tracking-widest glow-text" style={{ color: "var(--jarvis-accent)" }}>
          J.A.R.V.I.S
        </h1>
        <button
          onClick={() => setAutoSpeak(!autoSpeak)}
          className="text-xs px-3 py-1 rounded-full border transition-colors"
          style={{
            borderColor: autoSpeak ? "var(--jarvis-accent)" : "var(--jarvis-muted)",
            color: autoSpeak ? "var(--jarvis-accent)" : "var(--jarvis-muted)",
          }}
        >
          {autoSpeak ? "🔊 Voice ON" : "🔇 Voice OFF"}
        </button>
      </div>

      {/* Orb */}
      <div className="flex-shrink-0 py-6">
        <Orb state={state} />
      </div>

      {/* Status */}
      <StatusIndicator state={state} />

      {/* Chat */}
      <div className="flex-1 w-full overflow-y-auto mb-4" style={{ maxHeight: "50vh" }}>
        <ChatWindow messages={messages} />
      </div>

      {/* Input */}
      <InputBar
        onSend={sendMessage}
        onStopSpeaking={stopSpeaking}
        state={state}
        setState={setState}
      />
    </main>
  );
}
