import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID = ["NEW", "IN_PROGRESS", "SENT"] as const;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!VALID.includes(status)) return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });

  await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
