import { db } from "@/db";
import { apis } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const all = await db.select().from(apis).orderBy(apis.createdAt);
    return NextResponse.json({ apis: all });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch APIs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, schema } = await req.json();

    if (!name || !description || !schema) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const id = randomUUID();

    await db.insert(apis).values({
      id,
      name,
      description,
      schema: JSON.stringify(schema),
    });

    return NextResponse.json({ id, name, description, schema }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save API" }, { status: 500 });
  }
}