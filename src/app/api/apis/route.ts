import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const apis = db.getAllApis();
    return NextResponse.json({ apis });
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
    const api = db.insertApi({ id, name, description, schema: JSON.stringify(schema) });
    return NextResponse.json(api, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save API" }, { status: 500 });
  }
}