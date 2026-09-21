import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });

  await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: {
      storeName: String(body.storeName ?? "").trim() || undefined,
      phone: String(body.phone ?? "").trim(),
      address: String(body.address ?? "").trim(),
      shippingCost: Number(body.shippingCost) || 0,
      freeShippingOver: Number(body.freeShippingOver) || 0,
    },
    create: {
      id: "singleton",
      storeName: String(body.storeName ?? "פרפר סגול"),
      phone: String(body.phone ?? ""),
      address: String(body.address ?? ""),
      tickerHtml: "",
      shippingCost: Number(body.shippingCost) || 0,
      freeShippingOver: Number(body.freeShippingOver) || 0,
    },
  });

  return NextResponse.json({ ok: true });
}
