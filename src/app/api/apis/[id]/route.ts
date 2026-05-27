import { db } from "@/db";
import { apis } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const api = await db.select().from(apis).where(eq(apis.id, id)).get();

    if (!api) {
      return NextResponse.json({ error: "API not found" }, { status: 404 });
    }

    return NextResponse.json({ api });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch API" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(apis).where(eq(apis.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete API" }, { status: 500 });
  }
}