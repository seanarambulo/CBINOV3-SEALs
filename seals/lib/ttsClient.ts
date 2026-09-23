export const playTTS = async (text: string, volume: number = 1) => {
  if (!text) return;

  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`TTS API failed with status ${response.status}`);
    }

    // Check if the backend is returning our skeleton placeholder JSON
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("TTS Skeleton Hit:", data.message);
      return;
    }

    // Otherwise, we have actual audio data to play
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const audio = new Audio(url);
    audio.volume = volume;
    await audio.play();

    // Clean up the URL object once the audio finishes playing to avoid memory leaks
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
  } catch (error) {
    console.error("Failed to play TTS:", error);
  }
};

