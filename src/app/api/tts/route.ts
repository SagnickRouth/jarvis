export const runtime = "nodejs";

/**
 * ElevenLabs TTS proxy. Returns MP3 audio bytes for the given text.
 * Called from the client after an assistant message completes.
 */
export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return new Response("No text provided", { status: 400 });
  }

  // Conserve free-tier characters.
  const truncated = String(text).slice(0, 3000);

  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!voiceId || !apiKey) {
    return new Response("ElevenLabs not configured", { status: 500 });
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: truncated,
        model_id: process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.8 },
      }),
    }
  );

  if (!res.ok) {
    console.error("ElevenLabs error:", await res.text());
    return new Response("TTS failed", { status: 500 });
  }

  return new Response(await res.arrayBuffer(), {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-cache" },
  });
}
