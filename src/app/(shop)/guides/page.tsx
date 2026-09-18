import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  const guides = await prisma.guide.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="wrap" style={{ paddingBottom: 60 }}>
      <div className="crumb">
        <Link href="/">דף הבית</Link> ← מדריכים
      </div>
      <h1 style={{ fontSize: 30 }}>מדריכים</h1>
      <p style={{ color: "var(--ink-2)", maxWidth: "58ch" }}>
        מה שאנחנו מסבירות בחנות עשר פעמים ביום, כתוב. בלי מונחים מקצועיים ובלי לנסות למכור.
      </p>
      <div className="gg" style={{ marginTop: 22 }}>
        {guides.map((g) => (
          <Link className="p-card" href={`/guides/${g.id}`} key={g.id}>
            <div
              className="ph"
              style={{ aspectRatio: "16/10", background: "linear-gradient(140deg,#3B2352,#7A4C9E)" }}
            >
              <span className="glyph">{g.title}</span>
            </div>
            <div className="p-b">
              <span className="s">מדריך</span>
              <span className="n">{g.title}</span>
              <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{g.teaser}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
