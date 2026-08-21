import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { GenerateRequestSchema } from "@/lib/schema";
import { compileStudioPrompt } from "@/lib/compiler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod validation
    const validationResult = GenerateRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request payload: " +
            validationResult.error.errors
              .map((e) => `${e.path.join(".")}: ${e.message}`)
              .join(", "),
        },
        { status: 400 }
      );
    }

    const input = validationResult.data;

    // 2. Prompt compilation
    const compiledPrompt = compileStudioPrompt(input);

    // 3. API key validation
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GEMINI_API_KEY is not configured in .env.local on the server.",
        },
        { status: 500 }
      );
    }

    // 4. Initialize GoogleGenAI client
    const ai = new GoogleGenAI({ apiKey });

    // 5. Construct multimodal content parts
    const contentParts: any[] = [{ text: compiledPrompt }];

    if (input.baseImage && input.baseImage.trim().length > 0) {
      const cleanBase64 = input.baseImage.replace(
        /^data:image\/[a-zA-Z+.-]+;base64,/,
        ""
      );
      contentParts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: input.baseImageMimeType || "image/jpeg",
        },
      });
    }

    if (input.maskImage && input.maskImage.trim().length > 0) {
      const cleanMaskBase64 = input.maskImage.replace(
        /^data:image\/[a-zA-Z+.-]+;base64,/,
        ""
      );
      contentParts.push({
        inlineData: {
          data: cleanMaskBase64,
          mimeType: "image/png",
        },
      });
    }

    // 6. Generate content targeting gemini-3.1-flash-image (Nano Banana 2)
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: contentParts,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: input.aspectRatio,
        },
      },
    });

    // 7. Extract base64 image data from candidate content parts
    const candidate = response.candidates?.[0];
    if (
      !candidate ||
      !candidate.content?.parts ||
      candidate.content.parts.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          compiledPrompt,
          error:
            "No content parts received from Gemini Nano Banana model.",
        },
        { status: 502 }
      );
    }

    // Search for inlineData image part
    const imagePart = candidate.content.parts.find(
      (p) => p.inlineData && p.inlineData.data
    );

    if (!imagePart || !imagePart.inlineData) {
      const textPart = candidate.content.parts.find((p) => p.text);
      return NextResponse.json(
        {
          success: false,
          compiledPrompt,
          error:
            textPart?.text ||
            "The model did not return image data for the requested prompt.",
        },
        { status: 422 }
      );
    }

    const base64Image = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || "image/jpeg";

    return NextResponse.json({
      success: true,
      imageData: base64Image,
      mimeType: mimeType,
      compiledPrompt,
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "An unexpected error occurred during image generation.",
      },
      { status: 500 }
    );
  }
}
