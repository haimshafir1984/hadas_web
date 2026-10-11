import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Body: { sku, urls: string[], replace?: boolean } — urls already uploaded via /api/admin/upload.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.sku || !Array.isArray(body.urls) || !body.urls.length) {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }
  const product = await prisma.product.findUnique({ where: { sku: String(body.sku) }, select: { id: true } });
  if (!product) return NextResponse.json({ error: "no-product" }, { status: 404 });

  if (body.replace) await prisma.productImage.deleteMany({ where: { productId: product.id } });
  const base = await prisma.productImage.count({ where: { productId: product.id } });
  await prisma.productImage.createMany({
    data: (body.urls as string[]).map((url, i) => ({ url, order: base + i, productId: product.id })),
  });
  return NextResponse.json({ ok: true });
}
