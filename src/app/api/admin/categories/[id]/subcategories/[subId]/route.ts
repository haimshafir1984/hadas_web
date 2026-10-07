import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; subId: string }> }) {
  const { subId } = await params;
  const body = await req.json().catch(() => null);
  const iconUrl = typeof body?.iconUrl === "string" && body.iconUrl.trim() ? body.iconUrl.trim() : null;
  await prisma.subcategory.update({ where: { id: subId }, data: { iconUrl } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; subId: string }> }) {
  const { subId } = await params;
  await prisma.subcategory.delete({ where: { id: subId } });
  return NextResponse.json({ ok: true });
}
