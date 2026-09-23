import process from "node:process";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Initialize the client once outside the function (Singleton)
const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function generateTTSAudio(text: string): Promise<Buffer | null> {
  if (!text) throw new Error("No text provided");

  console.log(`[TTS Controller] Generating audio for: ${text}`);

  try {
    const response = await client.textToSpeech.convert(
      "JBFqnCBsd6RMkjVDRZzb", // Your specific voice ID
      {
        modelId: "eleven_v3", // Note: SDK might expect model_id instead of modelId, using standard ElevenLabs format
        text: text // Use the dynamic text clicked on the board
      }
    );

    // The ElevenLabs SDK returns a stream. We collect the chunks and turn them into a Buffer
    const chunks: any[] = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);

  } catch (error) {
    console.error("[TTS Controller] ElevenLabs API Error:", error);
    throw error;
  }
}

