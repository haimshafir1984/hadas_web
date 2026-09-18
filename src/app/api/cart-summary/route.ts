import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CartItem = { productId: string; size: string; color: string; qty: number };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const items: CartItem[] = Array.isArray(body?.items) ? body.items : [];

  const settings = await prisma.storeSettings.findUnique({ where: { id: "singleton" } });
  const shippingCost = settings?.shippingCost ?? 29;
  const freeShippingOver = settings?.freeShippingOver ?? 250;

  const ids = [...new Set(items.map((i) => i.productId))];
  const products = ids.length
    ? await prisma.product.findMany({
        where: { id: { in: ids } },
        include: { images: { orderBy: { order: "asc" }, take: 1 } },
      })
    : [];
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines = items
    .map((item, index) => {
      const p = byId.get(item.productId);
      if (!p) return null;
      return {
        index,
        productId: p.id,
        name: p.name,
        size: item.size,
        color: item.color,
        qty: item.qty,
        price: p.price,
        lineTotal: p.price * item.qty,
        gradientIndex: p.gradientIndex,
        image: p.images[0]?.url ?? null,
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const subtotal = lines.reduce((a, l) => a + l.lineTotal, 0);
  const shipping = subtotal >= freeShippingOver ? 0 : subtotal > 0 ? shippingCost : 0;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, freeShippingOver - subtotal);
  const progressPct = Math.min(100, (subtotal / freeShippingOver) * 100);

  return NextResponse.json({
    lines,
    subtotal,
    shipping,
    total,
    freeShippingOver,
    shippingCost,
    remainingForFreeShipping,
    progressPct,
  });
}
