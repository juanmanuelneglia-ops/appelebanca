import { NextResponse } from "next/server";
import { applyOpsActionServer } from "@/lib/ops-store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const { id } = await context.params;
  const body = (await request.json()) as {
    action?: string;
    imageSrc?: string;
    phrase?: string;
  };
  if (!body.action) {
    return NextResponse.json({ error: "action requerida" }, { status: 400 });
  }
  if (body.action === "send-imagen" && (!body.imageSrc || !body.phrase)) {
    return NextResponse.json(
      { error: "imageSrc y phrase requeridos" },
      { status: 400 },
    );
  }
  const session = applyOpsActionServer(id, body.action, {
    imageSrc: body.imageSrc,
    phrase: body.phrase,
  });
  if (!session) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ session });
}
