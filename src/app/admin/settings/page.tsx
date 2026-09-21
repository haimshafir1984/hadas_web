import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/SettingsForm";
import ResetDemoDataButton from "@/components/admin/ResetDemoDataButton";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "singleton" } });

  return (
    <AdminShell active="/admin/settings" title="הגדרות חנות">
      <SettingsForm
        initial={{
          storeName: settings?.storeName ?? "פרפר סגול",
          phone: settings?.phone ?? "",
          address: settings?.address ?? "",
          shippingCost: settings?.shippingCost ?? 29,
          freeShippingOver: settings?.freeShippingOver ?? 250,
        }}
      />
      <div className="panel">
        <h3>משתמשי ניהול</h3>
        <p style={{ color: "var(--ink-2)", margin: "0 0 10px", fontSize: 14 }}>
          כרגע קיים משתמש ניהול אחד קבוע: <b>admin</b> / <b>1234</b>. זה TODO מכוון — האתר עדיין בבדיקות אצל בעלת
          החנות, ואימות אמיתי (למשל NextAuth עם משתמשים וסיסמאות מוצפנות) יוחלף בהמשך. ראו README.
        </p>
      </div>
      <div className="panel">
        <h3>איפוס נתוני הדגמה</h3>
        <p style={{ color: "var(--ink-2)", margin: "0 0 12px", fontSize: 14 }}>
          מחזיר את הקטלוג, הקטגוריות, ההזמנות וההגדרות למצב ההתחלתי.
        </p>
        <ResetDemoDataButton />
      </div>
    </AdminShell>
  );
}
