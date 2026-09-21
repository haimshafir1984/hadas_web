import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import type { NavCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { subcategories: { orderBy: { order: "asc" } } },
  });
  const navCategories: NavCategory[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    subs: c.subcategories.map((s) => ({ id: s.id, name: s.name })),
  }));

  return (
    <AdminShell active="/admin/products" title="מוצר חדש" actions={<Link className="mini" href="/admin/products">ביטול</Link>}>
      <ProductForm
        categories={navCategories}
        initial={{
          name: "",
          categoryId: navCategories[0]?.id ?? "",
          subcategoryId: "",
          badge: "",
          price: 0,
          wasPrice: null,
          stock: 10,
          description: "",
          features: [],
          colors: ["#F4EFE9"],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          outOfStockSizes: [],
          gradientIndex: 0,
          imageUrls: [],
          extraCategoryIds: [],
        }}
      />
    </AdminShell>
  );
}
