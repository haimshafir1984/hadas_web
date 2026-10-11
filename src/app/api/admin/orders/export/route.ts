import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { NEW: "חדשה", IN_PROGRESS: "בטיפול", SENT: "נשלחה" };

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  const ids = new Set<string>();
  for (const o of orders) {
    if (Array.isArray(o.items)) for (const it of o.items as { productId?: string; id?: string }[]) ids.add(String(it.productId ?? it.id ?? ""));
  }
  const products = await prisma.product.findMany({ where: { id: { in: Array.from(ids) } }, select: { id: true, name: true, sku: true } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("הזמנות", { views: [{ rightToLeft: true, state: "frozen", ySplit: 1 }] });
  ws.columns = [
    { header: "מספר הזמנה", key: "n", width: 14 },
    { header: "תאריך", key: "d", width: 18 },
    { header: "לקוחה", key: "c", width: 20 },
    { header: "טלפון", key: "p", width: 14 },
    { header: "אימייל", key: "e", width: 24 },
    { header: "עיר", key: "city", width: 14 },
    { header: "כתובת", key: "a", width: 26 },
    { header: "פריטים", key: "i", width: 60 },
    { header: "משלוח", key: "s", width: 9 },
    { header: "סה״כ", key: "t", width: 10 },
    { header: "סטטוס", key: "st", width: 10 },
    { header: "הערות", key: "no", width: 30 },
  ];
  ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6D2E9E" } };

  for (const o of orders) {
    const items = Array.isArray(o.items) ? (o.items as { productId?: string; id?: string; size?: string; color?: string; qty?: number; q?: number }[]) : [];
    const summary = items
      .map((it) => {
        const p = byId.get(String(it.productId ?? it.id ?? ""));
        return `${p?.sku ? p.sku + " " : ""}${p?.name ?? "מוצר שנמחק"} (${it.size ?? "—"}) ×${it.qty ?? it.q ?? 1}`;
      })
      .join(" | ");
    ws.addRow({
      n: o.orderNumber,
      d: new Date(o.createdAt).toLocaleString("he-IL"),
      c: o.customerName,
      p: o.phone,
      e: o.email ?? "",
      city: o.city ?? "",
      a: o.address ?? "",
      i: summary,
      s: o.shipping,
      t: o.total,
      st: STATUS[o.status] ?? o.status,
      no: o.notes ?? "",
    });
  }

  const buf = await wb.xlsx.writeBuffer();
  return new Response(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="orders.xlsx"',
    },
  });
}
