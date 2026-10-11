import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function extraIds(body: { extraCategoryIds?: unknown; categoryId?: string }): string[] {
  const ids = Array.isArray(body.extraCategoryIds) ? (body.extraCategoryIds as string[]) : [];
  return ids.filter((id) => id !== body.categoryId);
}

export async function POST(req: NextRequest) {
  try {
    return await handlePost(req);
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return NextResponse.json({ error: "מק״ט זה כבר קיים במוצר אחר" }, { status: 409 });
    throw e;
  }
}

async function handlePost(req: NextRequest) {
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
      sku: body.sku ? String(body.sku).trim() : null,
      brand: body.brand ? String(body.brand).trim() : null,
      fabrics: Array.isArray(body.fabrics) ? body.fabrics : [],
      sizeSystem: body.sizeSystem ? String(body.sizeSystem) : null,
      attributes: Array.isArray(body.attributes) ? body.attributes : [],
      isActive: body.isActive !== false,
      gradientIndex: Number.isFinite(Number(body.gradientIndex)) ? Number(body.gradientIndex) : 0,
      extraCategories: { connect: extraIds(body).map((id) => ({ id })) },
      images: body.imageUrls?.length
        ? { create: body.imageUrls.map((url: string, order: number) => ({ url, order })) }
        : undefined,
    },
  });

  return NextResponse.json({ id: product.id });
}
