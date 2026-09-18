import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; subId: string }> }) {
  const { subId } = await params;
  await prisma.subcategory.delete({ where: { id: subId } });
  return NextResponse.json({ ok: true });
}
