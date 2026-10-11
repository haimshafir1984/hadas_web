import AdminShell from "@/components/admin/AdminShell";
import GuideForm from "@/components/admin/GuideForm";

export default function NewGuidePage() {
  return (
    <AdminShell active="/admin/guides" title="מדריך חדש">
      <GuideForm initial={{ title: "", teaser: "", sections: [["", ""]], steps: [] }} />
    </AdminShell>
  );
}
