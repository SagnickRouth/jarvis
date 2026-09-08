# 🤖 JARVIS — Personal AI Assistant

A voice-enabled, tool-calling AI assistant built with Next.js 15, the Vercel AI SDK,
OpenRouter, ElevenLabs, and Composio.

## Architecture

```
🎙️ Mic → Web Speech API → text
        │
        ▼
   /api/chat  ──►  Vercel AI SDK (streamText)
        │              ├─► OpenRouter (multi-model LLM, streaming)
        │              └─► Composio tools (Gmail / GitHub / Calendar)
        │                    └─ tool-call loop → result → LLM → stream
        ▼
   text streamed to UI  ──►  /api/tts (ElevenLabs) ──► 🔊 auto-play
```

All API keys stay **server-side** in Next.js API routes (`.env.local`).

## Features

- 💬 Streaming chat via OpenRouter (any model)
- 🛠️ Real tool calling — read/send Gmail, check Calendar, query GitHub (via Composio)
- 🔊 Auto-play voice responses (ElevenLabs, voice: Eric)
- 🎙️ Voice input (Web Speech API, Chrome/Edge)
- 🧠 Conversation memory (localStorage)
- 🌑 Dark, JARVIS-inspired UI with animated orb

## Quick Start

```bash
git clone https://github.com/SagnickRouth/jarvis.git
cd jarvis
git checkout ai-sdk-upgrade

npm install

cp .env.example .env.local
# Fill in your keys (see below)

npm run dev
```

Open http://localhost:3000.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ | OpenRouter API key |
| `OPENROUTER_MODEL` | ✅ | e.g. `anthropic/claude-sonnet-4` |
| `ELEVENLABS_API_KEY` | ✅ | ElevenLabs API key |
| `ELEVENLABS_VOICE_ID` | ✅ | Voice ID (default: Eric) |
| `ELEVENLABS_MODEL` | ❌ | Default `eleven_turbo_v2_5` |
| `COMPOSIO_API_KEY` | ❌ | Enables Gmail/GitHub/Calendar tools |
| `COMPOSIO_USER_ID` | ❌ | Composio user id (default: `default`) |

> Without `COMPOSIO_API_KEY`, chat + voice still work — only tool calling is disabled.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **AI:** Vercel AI SDK v5 (`ai`, `@ai-sdk/react`)
- **LLM:** OpenRouter (`@openrouter/ai-sdk-provider`)
- **Tools:** Composio (`@composio/core`, `@composio/vercel`)
- **TTS:** ElevenLabs
- **STT:** Web Speech API
- **UI:** Tailwind CSS, Framer Motion

## Key Files

| File | Purpose |
|------|---------|
| `src/app/api/chat/route.ts` | Streaming chat + tool-calling loop |
| `src/app/api/tts/route.ts` | ElevenLabs TTS proxy |
| `src/lib/composio.ts` | Composio client + tool fetching (server-only) |
| `src/lib/system-prompt.ts` | JARVIS persona |
| `src/lib/memory.ts` | localStorage conversation persistence |
| `src/hooks/useJarvis.ts` | Chat + TTS auto-play + state machine |

## License

MIT
