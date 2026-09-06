# 🤖 JARVIS — Personal AI Assistant

A voice-enabled AI assistant built with Next.js, OpenRouter, ElevenLabs, and Composio.

## Features

- 💬 **Text chat** — streaming responses via OpenRouter (multi-model LLM)
- 🔊 **Auto-play TTS** — responses spoken aloud via ElevenLabs
- 🎙️ **Voice input** — speak to JARVIS via Web Speech API
- 🛠️ **Tool calling** — Gmail, GitHub, Calendar via Composio (Phase 5)
- 🌑 **JARVIS-inspired UI** — dark theme with animated orb

## Quick Start

```bash
# 1. Clone
git clone https://github.com/SagnickRouth/jarvis.git
cd jarvis

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — JARVIS is ready.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ | Your OpenRouter API key |
| `OPENROUTER_MODEL` | ✅ | LLM model (e.g., `anthropic/claude-sonnet-4`) |
| `ELEVENLABS_API_KEY` | ✅ | Your ElevenLabs API key |
| `ELEVENLABS_VOICE_ID` | ✅ | Voice ID (default: Eric) |
| `ELEVENLABS_MODEL` | ❌ | TTS model (default: `eleven_turbo_v2_5`) |
| `COMPOSIO_API_KEY` | ❌ | For tool calling (Phase 5) |

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **LLM:** OpenRouter (via Vercel AI SDK)
- **TTS:** ElevenLabs
- **STT:** Web Speech API (Chrome/Edge)
- **Tools:** Composio (Gmail, GitHub, Calendar)

## Architecture

```
🎙️ Mic → Web Speech API → text → /api/chat → OpenRouter (streaming)
→ text displayed + /api/tts → ElevenLabs → auto-play audio 🔊
```

## License

MIT
