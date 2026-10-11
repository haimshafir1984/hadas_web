import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reorderIds } from "@/lib/reorder";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; subId: string }> }) {
  const { id, subId } = await params;
  const body = await req.json().catch(() => null);
  if (body?.move === "up" || body?.move === "down") {
    const all = await prisma.subcategory.findMany({ where: { categoryId: id }, orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true } });
    const next = reorderIds(all.map((s) => s.id), subId, body.move);
    if (next) await prisma.$transaction(next.map((sid, order) => prisma.subcategory.update({ where: { id: sid }, data: { order } })));
    return NextResponse.json({ ok: true });
  }
  if (body && "iconUrl" in body) {
    const iconUrl = typeof body.iconUrl === "string" && body.iconUrl.trim() ? body.iconUrl.trim() : null;
    await prisma.subcategory.update({ where: { id: subId }, data: { iconUrl } });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; subId: string }> }) {
  const { subId } = await params;
  await prisma.subcategory.delete({ where: { id: subId } });
  return NextResponse.json({ ok: true });
}
