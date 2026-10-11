import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { nis } from "@/lib/format";
import AdminShell from "@/components/admin/AdminShell";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

type RawItem = { productId?: string; id?: string; name?: string; size?: string; color?: string; qty?: number; priceAtOrder?: number };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();

  const raw = (Array.isArray(order.items) ? order.items : []) as RawItem[];
  const ids = [...new Set(raw.map((i) => i.productId ?? i.id).filter((x): x is string => !!x))];
  const products = ids.length ? await prisma.product.findMany({ where: { id: { in: ids } } }) : [];
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines = raw.map((i) => {
    const pid = i.productId ?? i.id ?? "";
    const p = byId.get(pid);
    const qty = i.qty ?? 1;
    const price = i.priceAtOrder ?? p?.price ?? 0;
    return { pid, name: i.name ?? p?.name ?? "מוצר שנמחק", exists: !!p, size: i.size ?? "—", color: i.color ?? null, qty, price, sum: price * qty };
  });
  const subtotal = lines.reduce((a, l) => a + l.sum, 0);

  return (
    <AdminShell
      active="/admin/orders"
      title={`הזמנה ${order.orderNumber}`}
      actions={
        <>
          <Link className="mini" href="/admin/orders">
            ← כל ההזמנות
          </Link>
          <PrintButton />
        </>
      }
    >
      <div className="panel">
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-2)" }}>התקבלה</div>
            <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleString("he-IL")}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-2)" }}>סטטוס</div>
            <OrderStatusSelect orderId={order.id} status={order.status} />
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>פרטי הלקוחה</h3>
        <div className="order-grid">
          <div><span>שם</span><b>{order.customerName}</b></div>
          <div><span>טלפון</span><b><a href={`tel:${order.phone}`}>{order.phone}</a></b></div>
          <div><span>מייל</span><b>{order.email ? <a href={`mailto:${order.email}`}>{order.email}</a> : "—"}</b></div>
          <div><span>עיר</span><b>{order.city ?? "—"}</b></div>
          <div><span>כתובת</span><b>{order.address ?? "—"}</b></div>
          <div className="order-notes"><span>הערות לשליח</span><b>{order.notes ?? "—"}</b></div>
        </div>
      </div>

      <div className="panel">
        <h3>מה הוזמן</h3>
        <div className="tw">
          <table className="atable">
            <thead>
              <tr>
                <th>מוצר</th>
                <th>מידה</th>
                <th>צבע</th>
                <th>כמות</th>
                <th>מחיר ליחידה</th>
                <th>סה״כ</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>
                    {l.exists ? <Link href={`/admin/products/${l.pid}/edit`}>{l.name}</Link> : l.name}
                  </td>
                  <td>{l.size}</td>
                  <td>{l.color ? <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", background: l.color, border: "1px solid var(--line)", verticalAlign: -3 }} /> : "—"}</td>
                  <td>{l.qty}</td>
                  <td className="mono">{nis(l.price)}</td>
                  <td className="mono">{nis(l.sum)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ maxWidth: 320, marginInlineStart: "auto", marginTop: 12 }}>
          <div className="sline"><span>מוצרים</span><span className="mono">{nis(subtotal)}</span></div>
          <div className="sline"><span>משלוח</span><span className="mono">{order.shipping ? nis(order.shipping) : "חינם"}</span></div>
          <div className="stot"><span>סה״כ</span><span className="mono">{nis(order.total)}</span></div>
        </div>
      </div>
    </AdminShell>
  );
}
