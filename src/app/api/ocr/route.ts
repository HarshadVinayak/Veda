import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image data' }, { status: 400 });
    }

    // Clean base64 data
    const base64Content = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const apiKey = process.env.GOOGLE_VISION_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Google Cloud API Key for OCR");
    }

    const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const body = {
      requests: [
        {
          image: {
            content: base64Content,
          },
          features: [
            {
              type: "TEXT_DETECTION",
            },
          ],
        },
      ],
    };

    const response = await fetch(VISION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    const fullText = result.responses?.[0]?.fullTextAnnotation?.text || "";

    if (!fullText) {
      return NextResponse.json({ 
        text: "Could not detect any text on this page. Please try with better lighting.",
        confidence: 0
      });
    }

    return NextResponse.json({ 
      text: fullText,
      confidence: result.responses?.[0]?.textAnnotations?.[0]?.score || 1,
      language: result.responses?.[0]?.textAnnotations?.[0]?.locale || "en"
    });

  } catch (err: any) {
    console.error("[OCR API Error]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
