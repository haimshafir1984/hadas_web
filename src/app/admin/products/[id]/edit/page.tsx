import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import type { NavCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { order: "asc" } } } }),
    prisma.category.findMany({ orderBy: { order: "asc" }, include: { subcategories: { orderBy: { order: "asc" } } } }),
  ]);
  if (!product) notFound();

  const navCategories: NavCategory[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    subs: c.subcategories.map((s) => ({ id: s.id, name: s.name })),
  }));

  return (
    <AdminShell
      active="/admin/products"
      title="עריכת מוצר"
      actions={
        <>
          <Link className="mini" href="/admin/products">
            ביטול
          </Link>
          <Link className="mini" href={`/p/${product.id}`}>
            תצוגה בחנות
          </Link>
        </>
      }
    >
      <ProductForm
        categories={navCategories}
        initial={{
          id: product.id,
          name: product.name,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId ?? "",
          badge: product.badge ?? "",
          price: product.price,
          wasPrice: product.wasPrice,
          stock: product.stock,
          description: product.description ?? "",
          features: product.features,
          colors: product.colors,
          sizes: product.sizes,
          outOfStockSizes: product.outOfStockSizes,
          gradientIndex: product.gradientIndex,
          imageUrls: product.images.map((i) => i.url),
        }}
      />
    </AdminShell>
  );
}
