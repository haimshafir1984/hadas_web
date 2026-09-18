import { prisma } from "@/lib/prisma";
import SiteChrome from "@/components/SiteChrome";
import SiteFooter from "@/components/SiteFooter";
import type { NavCategory } from "@/lib/types";

const DEFAULT_TICKER =
  "מבצע סוף עונה: <b>3 ב-₪249</b> על כל התחתונים · משלוח חינם מעל ₪250 · החזרה תוך 14 יום";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { subcategories: { orderBy: { order: "asc" } } },
    }),
    prisma.storeSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const navCategories: NavCategory[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    subs: c.subcategories.map((s) => ({ id: s.id, name: s.name })),
  }));

  return (
    <>
      <SiteChrome categories={navCategories} tickerHtml={settings?.tickerHtml ?? DEFAULT_TICKER} />
      <main>{children}</main>
      <SiteFooter
        categories={navCategories}
        storeName={settings?.storeName ?? "פרפר סגול"}
        address={settings?.address ?? "רח׳ הרצל 12, פתח תקווה"}
        phone={settings?.phone ?? "03-9000000"}
      />
    </>
  );
}
