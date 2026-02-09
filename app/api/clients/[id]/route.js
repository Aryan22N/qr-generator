import { NextResponse } from "next/server";
import { getClient, updateClient } from "../../../lib/clientsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const { id } = params || {};

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const client = await getClient(id);
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json(client, { status: 200 });
}

export async function PUT(req, { params }) {
  const { id } = params || {};

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let payload = null;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!payload || !payload.editKey) {
    return NextResponse.json(
      { error: "Missing editKey" },
      { status: 400 }
    );
  }

  const existing = await getClient(id);
  if (!existing) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (existing.editKey !== payload.editKey) {
    return NextResponse.json({ error: "Invalid editKey" }, { status: 403 });
  }

  const { editKey, ...updates } = payload;
  const updated = await updateClient(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json(updated, { status: 200 });
}
