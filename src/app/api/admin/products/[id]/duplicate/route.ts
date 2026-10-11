import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { id }, include: { images: true, extraCategories: { select: { id: true } } } });
  if (!p) return NextResponse.json({ error: "לא נמצא" }, { status: 404 });

  const copy = await prisma.product.create({
    data: {
      name: `${p.name} (עותק)`,
      sku: null,
      subtitle: p.subtitle,
      categoryId: p.categoryId,
      subcategoryId: p.subcategoryId,
      price: p.price,
      wasPrice: p.wasPrice,
      stock: p.stock,
      description: p.description,
      features: p.features,
      colors: p.colors,
      sizes: p.sizes,
      outOfStockSizes: p.outOfStockSizes,
      badge: p.badge,
      attributes: p.attributes,
      brand: p.brand,
      fabrics: p.fabrics,
      sizeSystem: p.sizeSystem,
      isActive: false, // a copy starts hidden until it is edited
      sortOrder: p.sortOrder,
      gradientIndex: p.gradientIndex,
      extraCategories: { connect: p.extraCategories.map((c) => ({ id: c.id })) },
      images: { create: p.images.map((i) => ({ url: i.url, order: i.order })) },
    },
  });
  return NextResponse.json({ id: copy.id });
}
