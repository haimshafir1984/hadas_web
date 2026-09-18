import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import AddCategoryForm from "@/components/admin/AddCategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { subcategories: true, products: { select: { id: true } } },
  });

  return (
    <AdminShell active="/admin/cats" title="קטגוריות">
      <AddCategoryForm />
      <div className="panel">
        <h3>הקטגוריות שלך ({categories.length})</h3>
        <div className="tw">
          <table className="atable">
            <thead>
              <tr>
                <th>שם</th>
                <th>מזהה</th>
                <th>תת-קטגוריות</th>
                <th>מוצרים</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: "var(--ink-2)", fontSize: 13 }}>{c.id}</td>
                  <td>{c.subcategories.length}</td>
                  <td>{c.products.length}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <Link className="mini" href={`/admin/cats/${c.id}`}>
                      עריכה
                    </Link>{" "}
                    <Link className="mini" href={`/c/${c.id}`}>
                      תצוגה
                    </Link>{" "}
                    <DeleteCategoryButton id={c.id} name={c.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
