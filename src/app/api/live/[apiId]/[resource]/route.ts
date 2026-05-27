import { db } from "@/db";
import { apis, records } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ apiId: string; resource: string }> };

async function getApi(apiId: string) {
  return await db.select().from(apis).where(eq(apis.id, apiId)).get();
}

function validateResource(schema: string, resource: string): boolean {
  const parsed = JSON.parse(schema);
  return parsed.resources.some(
    (r: { name: string }) => r.name === resource
  );
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { apiId, resource } = await params;
  const api = await getApi(apiId);
  if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });
  if (!validateResource(api.schema, resource))
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });

  const rows = await db
    .select()
    .from(records)
    .where(and(eq(records.apiId, apiId), eq(records.resource, resource)));

  const data = rows.map((r) => ({ id: r.id, ...JSON.parse(r.data) }));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { apiId, resource } = await params;
  const api = await getApi(apiId);
  if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });
  if (!validateResource(api.schema, resource))
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });

  const body = await req.json();
  const id = randomUUID();

  await db.insert(records).values({
    id,
    apiId,
    resource,
    data: JSON.stringify(body),
  });

  return NextResponse.json({ id, ...body }, { status: 201 });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { apiId } = await params;
  const recordId = req.nextUrl.searchParams.get("recordId");
  if (!recordId)
    return NextResponse.json({ error: "recordId is required" }, { status: 400 });

  const api = await getApi(apiId);
  if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });

  const body = await req.json();

  await db
    .update(records)
    .set({ data: JSON.stringify(body) })
    .where(and(eq(records.id, recordId), eq(records.apiId, apiId)));

  return NextResponse.json({ id: recordId, ...body });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { apiId } = await params;
  const recordId = req.nextUrl.searchParams.get("recordId");
  if (!recordId)
    return NextResponse.json({ error: "recordId is required" }, { status: 400 });

  const api = await getApi(apiId);
  if (!api) return NextResponse.json({ error: "API not found" }, { status: 404 });

  await db
    .delete(records)
    .where(and(eq(records.id, recordId), eq(records.apiId, apiId)));

  return NextResponse.json({ success: true });
}