import AdminShell from "@/components/admin/AdminShell";
import TextsForm from "@/components/admin/TextsForm";
import { TEXT_DEFS, getTexts } from "@/lib/site-texts";

export const dynamic = "force-dynamic";

export default async function AdminTextsPage() {
  const texts = await getTexts();
  return (
    <AdminShell active="/admin/texts" title="טקסטים באתר">
      <p style={{ color: "var(--ink-2)", marginTop: 0 }}>
        עריכת הטקסטים של עמוד הראשי, עלינו, הפוטר ומדריך המידות. שדה ריק מחזיר את טקסט ברירת המחדל.
      </p>
      <TextsForm fields={TEXT_DEFS.map((d) => ({ key: d.key, label: d.label, group: d.group, multiline: d.multiline, value: texts[d.key] }))} />
    </AdminShell>
  );
}
