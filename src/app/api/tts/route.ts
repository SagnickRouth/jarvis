export const runtime = "nodejs";

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return new Response("No text provided", { status: 400 });
  }

  // Truncate to avoid excessive TTS cost (free tier ~10k chars/month)
  const truncated = text.slice(0, 3000);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: truncated,
        model_id: process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("ElevenLabs error:", err);
    return new Response("TTS failed", { status: 500 });
  }

  const audio = await response.arrayBuffer();

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-cache",
    },
  });
}
