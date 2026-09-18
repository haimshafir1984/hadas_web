import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, openOrders, lowStock, recentOrders, settings] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count({ where: { status: "NEW" } }),
    prisma.product.findMany({ where: { stock: { lte: 6 } }, include: { category: true }, orderBy: { stock: "asc" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.storeSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const stats: [string, number, string][] = [
    ["מוצרים בקטלוג", productCount, ""],
    ["קטגוריות", categoryCount, ""],
    ["הזמנות פתוחות", openOrders, ""],
    ["פריטים במלאי נמוך", lowStock.length, lowStock.length ? "warn" : ""],
  ];

  return (
    <AdminShell
      active="/admin"
      title="סקירה כללית"
      storeName={settings?.storeName}
      actions={
        <Link className="btn-v" style={{ borderRadius: 10, padding: "9px 18px", fontSize: 14 }} href="/admin/products/new">
          + מוצר חדש
        </Link>
      }
    >
      <div className="stats">
        {stats.map(([k, v, c]) => (
          <div className="stat" key={k}>
            <div className="k">{k}</div>
            <div className={`v ${c}`}>{v}</div>
          </div>
        ))}
      </div>
      <div className="panel">
        <h3>הזמנות אחרונות</h3>
        <OrdersTable orders={recentOrders} />
      </div>
      <div className="panel">
        <h3>מלאי נמוך (6 יחידות ומטה)</h3>
        {lowStock.length ? (
          <div className="tw">
            <table className="atable">
              <thead>
                <tr>
                  <th>מוצר</th>
                  <th>קטגוריה</th>
                  <th>מלאי</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category.name}</td>
                    <td style={{ color: "var(--coral)", fontWeight: 700 }}>{p.stock}</td>
                    <td>
                      <Link className="mini" href={`/admin/products/${p.id}/edit`}>
                        עריכה
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "var(--ink-2)", margin: 0 }}>אין פריטים במלאי נמוך.</p>
        )}
      </div>
    </AdminShell>
  );
}
