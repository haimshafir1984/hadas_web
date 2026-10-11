import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell
      active="/admin/orders"
      title="הזמנות"
      actions={
        <a className="mini" href="/api/admin/orders/export">
          ייצוא לאקסל
        </a>
      }
    >
      <div className="panel">
        <OrdersTable orders={orders} />
      </div>
    </AdminShell>
  );
}
