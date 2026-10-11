import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Body: { action: "delete" | "hide" | "show" | "price" | "category" | "sort", ids: string[], ... }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids) ? body.ids.map(String) : [];
  if (!body?.action || !ids.length) return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  const where = { id: { in: ids } };

  switch (body.action) {
    case "delete": {
      const r = await prisma.product.deleteMany({ where });
      return NextResponse.json({ count: r.count });
    }
    case "hide":
    case "show": {
      const r = await prisma.product.updateMany({ where, data: { isActive: body.action === "show" } });
      return NextResponse.json({ count: r.count });
    }
    case "category": {
      const cat = await prisma.category.findUnique({ where: { id: String(body.categoryId) } });
      if (!cat) return NextResponse.json({ error: "קטגוריה לא קיימת" }, { status: 400 });
      const r = await prisma.product.updateMany({ where, data: { categoryId: cat.id, subcategoryId: null } });
      return NextResponse.json({ count: r.count });
    }
    case "sort": {
      const r = await prisma.product.updateMany({ where, data: { sortOrder: Math.trunc(Number(body.value) || 0) } });
      return NextResponse.json({ count: r.count });
    }
    case "price": {
      // mode: "percent" (e.g. -10 = 10% off) or "amount" (₪ added). keepWas: store old price as "was" price (sale).
      const value = Number(body.value);
      if (!Number.isFinite(value) || value === 0) return NextResponse.json({ error: "ערך לא תקין" }, { status: 400 });
      const products = await prisma.product.findMany({ where, select: { id: true, price: true, wasPrice: true } });
      await prisma.$transaction(
        products.map((p) => {
          const next = Math.max(1, Math.round(body.mode === "amount" ? p.price + value : p.price * (1 + value / 100)));
          const wasPrice = body.keepWas && next < p.price ? (p.wasPrice ?? p.price) : p.wasPrice;
          return prisma.product.update({ where: { id: p.id }, data: { price: next, wasPrice: wasPrice && wasPrice > next ? wasPrice : null } });
        }),
      );
      return NextResponse.json({ count: products.length });
    }
    default:
      return NextResponse.json({ error: "פעולה לא מוכרת" }, { status: 400 });
  }
}
