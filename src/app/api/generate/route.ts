import { getGroqClient, SCHEMA_SYSTEM_PROMPT } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function cleanJsonString(content: string): string {
  let cleaned = content.trim();

  // Strip markdown code block wrappers if present (e.g. ```json ... ```)
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // Extract from the first opening brace to the last closing brace
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SCHEMA_SYSTEM_PROMPT },
        { role: "user", content: prompt.trim() },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const cleaned = cleanJsonString(raw);
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ schema: parsed });
  } catch (err: unknown) {
    console.error("Schema generation error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to generate schema";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}