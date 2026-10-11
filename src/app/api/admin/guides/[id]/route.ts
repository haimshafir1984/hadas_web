import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guideData } from "@/lib/guide-data";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const data = guideData(body ?? {});
  if (!data.title) return NextResponse.json({ error: "נא להזין כותרת" }, { status: 400 });
  await prisma.guide.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.guide.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
