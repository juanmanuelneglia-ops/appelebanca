import { NextResponse } from "next/server";
import type { OpsSession } from "@/lib/ops-channel";
import {
  getOpsSession,
  patchOpsSessionServer,
} from "@/lib/ops-store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const session = getOpsSession(id);
  if (!session) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ session });
}

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const patch = (await request.json()) as Partial<OpsSession>;
  const session = patchOpsSessionServer(id, patch);
  if (!session) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ session });
}
