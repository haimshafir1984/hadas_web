import AdminShell from "@/components/admin/AdminShell";
import BulkImages from "@/components/admin/BulkImages";

export default function BulkImagesPage() {
  return (
    <AdminShell active="/admin/import/images" title="העלאת תמונות בכמות">
      <BulkImages />
    </AdminShell>
  );
}
