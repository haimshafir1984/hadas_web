import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import CategoryEditForm from "@/components/admin/CategoryEditForm";
import SubcategoryManager from "@/components/admin/SubcategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { subcategories: { orderBy: { order: "asc" } } },
  });
  if (!category) notFound();

  return (
    <AdminShell active="/admin/cats" title="עריכת קטגוריה" actions={<Link className="mini" href="/admin/cats">חזרה לרשימה</Link>}>
      <CategoryEditForm categoryId={category.id} name={category.name} blurb={category.blurb ?? ""} />
      <SubcategoryManager categoryId={category.id} subs={category.subcategories.map((s) => ({ id: s.id, name: s.name }))} />
    </AdminShell>
  );
}
