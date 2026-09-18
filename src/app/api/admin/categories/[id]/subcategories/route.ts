import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "נא להזין שם" }, { status: 400 });

  const count = await prisma.subcategory.count({ where: { categoryId: id } });
  const sub = await prisma.subcategory.create({ data: { name, order: count, categoryId: id } });

  return NextResponse.json({ id: sub.id });
}
