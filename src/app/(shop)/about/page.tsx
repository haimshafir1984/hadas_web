import Link from "next/link";
import { getTexts } from "@/lib/site-texts";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const t = await getTexts();
  const cards = [1, 2, 3, 4].map((n) => [t[`about.c${n}.title`], t[`about.c${n}.text`]] as [string, string]);
  return (
    <div className="wrap" style={{ paddingBottom: 60 }}>
      <div className="crumb">
        <Link href="/">דף הבית</Link> ← עלינו
      </div>
      <h1 style={{ fontSize: "clamp(26px,4vw,36px)" }}>{t["about.title"]}</h1>
      <p style={{ color: "var(--ink-2)", maxWidth: "66ch" }}>{t["about.text"]}</p>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", marginTop: 26 }}>
        {cards.map(([h, x]) => (
          <div className="p-card" style={{ padding: 20 }} key={h}>
            <h3 style={{ fontSize: 19, marginBottom: 6 }}>{h}</h3>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)" }}>{x}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
