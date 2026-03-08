import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export async function POST(req: NextRequest) {
  if (!ai) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 503 }
    );
  }

  try {
    const { headline, summary, category, sourceName } = await req.json();

    if (!headline) {
      return NextResponse.json({ error: "headline is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are Terra, Landeed's property intelligence AI. Landeed is India's digital infrastructure for property intelligence, land records, and due diligence.

Analyze this Indian real estate news article and return a JSON object with two fields:

1. "analysis" — exactly 3 bullet points as a single string. Each bullet is one concise sentence framed from a property intelligence perspective. Use "•" as the bullet character, one per line.

2. "impacts" — an array of 4-6 objects, each with:
   - "label": a short category name (e.g. "Property Prices", "Buyer Demand", "Rental Yields", "Construction Activity", "Regulatory Risk", "Investment Flow", "Lending Rates", "Land Values", "Developer Margins", "Affordable Housing")
   - "direction": one of "up", "down", or "neutral"
   Pick only the categories relevant to this specific article.

Category: ${category || "General"}
Source: ${sourceName || "Unknown"}
Headline: ${headline}
Summary: ${summary || "No summary available"}

Respond with ONLY valid JSON, no markdown fences, no extra text. Example format:
{"analysis":"• First insight\\n• Second insight\\n• Third insight","impacts":[{"label":"Property Prices","direction":"up"},{"label":"Regulatory Risk","direction":"down"}]}`,
    });

    const text = response.text ?? "";

    // Parse the JSON response
    try {
      // Strip markdown fences if present
      const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({
        summary: parsed.analysis || "",
        impacts: Array.isArray(parsed.impacts) ? parsed.impacts : [],
      });
    } catch {
      // Fallback: treat entire response as plain text analysis
      return NextResponse.json({ summary: text, impacts: [] });
    }
  } catch (err) {
    console.error("[summarize] API error:", err);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
