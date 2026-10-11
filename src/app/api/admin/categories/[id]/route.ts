import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reorderIds } from "@/lib/reorder";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const blurb = String(body?.blurb ?? "").trim();

  await prisma.category.update({
    where: { id },
    data: { ...(name ? { name } : {}), blurb },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (body?.move !== "up" && body?.move !== "down") return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  const all = await prisma.category.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true } });
  const next = reorderIds(all.map((c) => c.id), id, body.move);
  if (next) await prisma.$transaction(next.map((cid, order) => prisma.category.update({ where: { id: cid }, data: { order } })));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: `יש ${productCount} מוצרים בקטגוריה זו. יש למחוק או להעביר אותם קודם.` },
      { status: 400 }
    );
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
