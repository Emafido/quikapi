import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ apiId: string; resource: string }> };

function validateResource(schema: string, resource: string): boolean {
  const parsed = JSON.parse(schema);
  return parsed.resources.some((r: { name: string }) => r.name === resource);
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { apiId, resource } = await params;
  const api = db.getApiById(apiId);
  if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });
  if (!validateResource(api.schema, resource))
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });

  const rows = db.getRecords(apiId, resource);
  const data = rows.map((r) => ({ id: r.id, ...JSON.parse(r.data) }));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { apiId, resource } = await params;
  const api = db.getApiById(apiId);
  if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });
  if (!validateResource(api.schema, resource))
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });

  const body = await req.json();
  const id = randomUUID();
  const record = db.insertRecord({ id, apiId, resource, data: JSON.stringify(body) });
  return NextResponse.json({ id: record.id, ...body }, { status: 201 });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { apiId } = await params;
  const recordId = req.nextUrl.searchParams.get("recordId");
  if (!recordId)
    return NextResponse.json({ error: "recordId is required" }, { status: 400 });

  const api = db.getApiById(apiId);
  if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });

  const body = await req.json();
  const updated = db.updateRecord(recordId, JSON.stringify(body));
  if (!updated)
    return NextResponse.json({ error: "Record not found" }, { status: 404 });

  return NextResponse.json({ id: recordId, ...body });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { apiId } = await params;
  const recordId = req.nextUrl.searchParams.get("recordId");
  if (!recordId)
    return NextResponse.json({ error: "recordId is required" }, { status: 400 });

  const api = db.getApiById(apiId);
  if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });

  db.deleteRecord(recordId);
  return NextResponse.json({ success: true });
}