import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CartItem = { productId: string; size: string; color: string; qty: number };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });

  const items: CartItem[] = Array.isArray(body.items) ? body.items : [];
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const city = String(body.city ?? "").trim();
  const address = String(body.address ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  if (!items.length) return NextResponse.json({ error: "הסל ריק" }, { status: 400 });
  if (!name || !phone) return NextResponse.json({ error: "נא למלא שם וטלפון" }, { status: 400 });

  const settings = await prisma.storeSettings.findUnique({ where: { id: "singleton" } });
  const shippingCost = settings?.shippingCost ?? 29;
  const freeShippingOver = settings?.freeShippingOver ?? 250;

  const ids = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const orderItems = items
    .map((i) => {
      const p = byId.get(i.productId);
      if (!p) return null;
      return { productId: p.id, name: p.name, size: i.size, color: i.color, qty: i.qty, priceAtOrder: p.price };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  if (!orderItems.length) return NextResponse.json({ error: "הסל ריק" }, { status: 400 });

  const subtotal = orderItems.reduce((a, i) => a + i.priceAtOrder * i.qty, 0);
  const shipping = subtotal >= freeShippingOver ? 0 : shippingCost;
  const total = subtotal + shipping;

  const orderCount = await prisma.order.count();
  const orderNumber = `PS-${10482 + orderCount}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: name,
      phone,
      email: email || null,
      city: city || null,
      address: address || null,
      notes: notes || null,
      items: orderItems,
      shipping,
      total,
      status: "NEW",
    },
  });

  return NextResponse.json({ orderNumber: order.orderNumber });
}
