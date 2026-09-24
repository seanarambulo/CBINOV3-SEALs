import { puter } from "@heyputer/puter.js";

export const playTTS = async (text: string, volume: number = 1) => {
  if (!text) return;

  try {
    const audio = await puter.ai.txt2speech(text, {
    voice: "Andres",
    engine: "neural",
    language: "es-MX",
  });

    audio.volume = volume;

    await audio.play();
  } catch (error) {
    console.error("Failed to play Puter TTS:", error);
  }
};