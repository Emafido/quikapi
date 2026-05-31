import { getGroqClient, SCHEMA_SYSTEM_PROMPT } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SCHEMA_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw);

    return NextResponse.json({ schema: parsed });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate schema" },
      { status: 500 }
    );
  }
}