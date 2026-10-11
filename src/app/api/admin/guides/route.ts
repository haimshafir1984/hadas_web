import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guideData } from "@/lib/guide-data";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const data = guideData(body ?? {});
  if (!data.title) return NextResponse.json({ error: "נא להזין כותרת" }, { status: 400 });
  const order = await prisma.guide.count();
  const g = await prisma.guide.create({ data: { ...data, order } });
  return NextResponse.json({ id: g.id });
}
