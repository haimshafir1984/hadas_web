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

  // Requested quantity per product (a product can appear in several size/color lines).
  const wanted = new Map<string, number>();
  const orderItems: { productId: string; name: string; size: string; color: string; qty: number; priceAtOrder: number }[] = [];
  for (const i of items) {
    const p = byId.get(i.productId);
    const qty = Math.floor(Number(i.qty));
    if (!p || !Number.isFinite(qty) || qty < 1) continue;
    if (p.outOfStockSizes.includes(i.size)) {
      return NextResponse.json({ error: `המידה ${i.size} של "${p.name}" אזלה. נא להסיר אותה מהסל.` }, { status: 409 });
    }
    wanted.set(p.id, (wanted.get(p.id) ?? 0) + qty);
    orderItems.push({ productId: p.id, name: p.name, size: i.size, color: i.color, qty, priceAtOrder: p.price });
  }
  if (!orderItems.length) return NextResponse.json({ error: "הסל ריק" }, { status: 400 });

  for (const [id, qty] of wanted) {
    const p = byId.get(id)!;
    if (p.stock < qty) {
      const msg = p.stock <= 0 ? `"${p.name}" אזל מהמלאי.` : `"${p.name}": נשארו רק ${p.stock} יחידות במלאי.`;
      return NextResponse.json({ error: msg }, { status: 409 });
    }
  }

  const subtotal = orderItems.reduce((a, i) => a + i.priceAtOrder * i.qty, 0);
  const shipping = subtotal >= freeShippingOver ? 0 : shippingCost;
  const total = subtotal + shipping;

  // Order number = next free PS-number; retry if two orders race for the same one.
  for (let attempt = 0; attempt < 5; attempt++) {
    const orderCount = await prisma.order.count();
    const orderNumber = `PS-${10482 + orderCount + attempt}`;
    try {
      const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
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
        // Conditional decrement: fails (count 0) if stock changed since the check above.
        for (const [id, qty] of wanted) {
          const res = await tx.product.updateMany({ where: { id, stock: { gte: qty } }, data: { stock: { decrement: qty } } });
          if (res.count !== 1) throw new Error("STOCK_CHANGED");
        }
        return created;
      });
      return NextResponse.json({ orderNumber: order.orderNumber });
    } catch (e) {
      if (e instanceof Error && e.message === "STOCK_CHANGED") {
        return NextResponse.json({ error: "המלאי השתנה בזמן שמילאת את הפרטים. נא לרענן את הסל ולנסות שוב." }, { status: 409 });
      }
      const code = (e as { code?: string }).code;
      if (code === "P2002") continue; // order number taken, try the next one
      throw e;
    }
  }
  return NextResponse.json({ error: "לא הצלחנו לשמור את ההזמנה. נסי שוב." }, { status: 500 });
}
