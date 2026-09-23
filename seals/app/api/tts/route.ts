import { NextResponse } from "next/server";
import { generateTTSAudio } from "@/controllers/ttsController";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Pass the text to your controller where the actual logic lives
    const audioBuffer = await generateTTSAudio(text);

    // If the controller isn't implemented yet, it returns null
    if (!audioBuffer) {
      return NextResponse.json({ 
        message: "TTS skeleton triggered successfully. Implement your API logic in controllers/ttsController.ts" 
      });
    }

    const responseBuffer = new ArrayBuffer(audioBuffer.byteLength);
    new Uint8Array(responseBuffer).set(audioBuffer);

    return new NextResponse(responseBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("[TTS API Error]:", error);
    return NextResponse.json(
      { error: "Failed to generate TTS" }, 
      { status: 500 }
    );
  }
}

