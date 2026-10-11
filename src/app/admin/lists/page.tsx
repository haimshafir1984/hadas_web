import AdminShell from "@/components/admin/AdminShell";
import ListsForm from "@/components/admin/ListsForm";
import { LIST_DEFS, getLists } from "@/lib/import-lists";

export const dynamic = "force-dynamic";

export default async function ListsPage() {
  const lists = await getLists();
  return (
    <AdminShell active="/admin/lists" title="רשימות לאקסל">
      <ListsForm defs={LIST_DEFS.map((d) => ({ key: d.key, label: d.label, values: lists[d.key] }))} />
    </AdminShell>
  );
}
