import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import ProductsTable, { AdminProductRow } from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, subcategory: true, images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const rows: AdminProductRow[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    badge: p.badge,
    categoryName: p.category.name,
    subcategoryName: p.subcategory?.name ?? null,
    price: p.price,
    wasPrice: p.wasPrice,
    stock: p.stock,
    sizesCount: p.sizes.length,
    gradientIndex: p.gradientIndex,
    imageUrl: p.images[0]?.url ?? null,
  }));

  return (
    <AdminShell
      active="/admin/products"
      title="מוצרים"
      actions={
        <Link className="btn-v" style={{ borderRadius: 10, padding: "9px 18px", fontSize: 14 }} href="/admin/products/new">
          + מוצר חדש
        </Link>
      }
    >
      <ProductsTable rows={rows} />
    </AdminShell>
  );
}
