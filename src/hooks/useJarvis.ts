"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useCallback, useState } from "react";
import { loadHistory, saveHistory } from "@/lib/memory";
import type { AssistantState } from "@/types";

/**
 * Core JARVIS hook.
 * - Wraps the Vercel AI SDK useChat for streaming chat + tool calls.
 * - Auto-plays each completed assistant message via ElevenLabs TTS.
 * - Persists history to localStorage.
 * - Exposes an assistant state machine for the UI (orb / status).
 */
export function useJarvis() {
  const [state, setState] = useState<AssistantState>("idle");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spokenIds = useRef<Set<string>>(new Set());

  const chat = useChat({
    api: "/api/chat",
    initialMessages: loadHistory(),
    onError: () => setState("idle"),
  });

  const { messages, status } = chat;

  // Reflect chat status into the assistant state machine.
  useEffect(() => {
    if (status === "submitted" || status === "streaming") {
      setState("thinking");
    }
  }, [status]);

  // Persist history whenever it changes.
  useEffect(() => {
    if (messages.length) saveHistory(messages);
  }, [messages]);

  // Extract plain text from a UIMessage's parts.
  const messageText = useCallback((m: (typeof messages)[number]): string => {
    return (m.parts || [])
      .filter((p: { type: string }) => p.type === "text")
      .map((p: { text?: string }) => p.text || "")
      .join(" ")
      .trim();
  }, []);

  // Auto-speak newly completed assistant messages.
  useEffect(() => {
    if (!autoSpeak || status === "streaming" || status === "submitted") return;

    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (spokenIds.current.has(last.id)) return;

    const text = messageText(last);
    if (!text) return;

    spokenIds.current.add(last.id);
    void speak(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, messages, autoSpeak]);

  const speak = useCallback(async (text: string) => {
    try {
      setState("speaking");
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("tts failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };
      await audio.play(); // works because triggered after a user gesture
    } catch {
      setState("idle");
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    audioRef.current?.pause();
    setState("idle");
  }, []);

  return {
    ...chat,
    messageText,
    state,
    setState,
    autoSpeak,
    setAutoSpeak,
    speak,
    stopSpeaking,
  };
}
