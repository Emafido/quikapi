import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const api = db.getApiById(id);
    if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });
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
    db.deleteApi(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete API" }, { status: 500 });
  }
}