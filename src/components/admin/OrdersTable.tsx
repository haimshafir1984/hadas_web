import { nis } from "@/lib/format";
import OrderStatusSelect from "./OrderStatusSelect";

type OrderRow = {
  id: string;
  orderNumber: string;
  createdAt: Date;
  customerName: string;
  phone: string;
  city: string | null;
  items: unknown;
  total: number;
  status: string;
};

export default function OrdersTable({ orders }: { orders: OrderRow[] }) {
  if (!orders.length) return <p style={{ color: "var(--ink-2)", margin: 0 }}>אין הזמנות עדיין.</p>;

  return (
    <div className="tw">
      <table className="atable">
        <thead>
          <tr>
            <th>מספר</th>
            <th>תאריך</th>
            <th>לקוחה</th>
            <th>פריטים</th>
            <th>סה״כ</th>
            <th>סטטוס</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const items = Array.isArray(o.items) ? (o.items as { qty: number }[]) : [];
            const qty = items.reduce((a, i) => a + (i.qty ?? 0), 0);
            return (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.orderNumber}</td>
                <td>{new Date(o.createdAt).toLocaleDateString("he-IL")}</td>
                <td>
                  {o.customerName}
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
                    {o.phone} · {o.city ?? "—"}
                  </div>
                </td>
                <td>{qty}</td>
                <td className="mono" style={{ fontWeight: 600 }}>
                  {nis(o.total)}
                </td>
                <td>
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
