import AdminShell from "@/components/admin/AdminShell";
import ImportClient from "@/components/admin/ImportClient";

export default function ImportPage() {
  return (
    <AdminShell active="/admin/import" title="ייבוא מוצרים מאקסל">
      <ImportClient />
    </AdminShell>
  );
}
