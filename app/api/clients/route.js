import { NextResponse } from "next/server";
import { saveClient } from "../../lib/clientsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  let payload = null;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!payload || !payload.id || !payload.editKey) {
    return NextResponse.json(
      { error: "Missing id or editKey" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const client = {
    ...payload,
    createdAt: payload.createdAt || now,
    updatedAt: payload.updatedAt || now,
  };

  await saveClient(client);

  return NextResponse.json(client, { status: 201 });
}
