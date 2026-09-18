import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: "נא להזין שם מוצר" }, { status: 400 });

  const product = await prisma.product.create({
    data: {
      name: body.name,
      categoryId: body.categoryId,
      subcategoryId: body.subcategoryId || null,
      price: Number(body.price) || 0,
      wasPrice: body.wasPrice ? Number(body.wasPrice) : null,
      stock: Number.isFinite(Number(body.stock)) ? Number(body.stock) : 0,
      description: body.description || "",
      features: Array.isArray(body.features) ? body.features : [],
      colors: Array.isArray(body.colors) && body.colors.length ? body.colors : ["#F4EFE9"],
      sizes: Array.isArray(body.sizes) && body.sizes.length ? body.sizes : ["מידה אחת"],
      outOfStockSizes: Array.isArray(body.outOfStockSizes) ? body.outOfStockSizes : [],
      badge: body.badge || null,
      gradientIndex: Number.isFinite(Number(body.gradientIndex)) ? Number(body.gradientIndex) : 0,
      images: body.imageUrls?.length
        ? { create: body.imageUrls.map((url: string, order: number) => ({ url, order })) }
        : undefined,
    },
  });

  return NextResponse.json({ id: product.id });
}
