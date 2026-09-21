import Link from "next/link";
import { getTexts } from "@/lib/site-texts";
import { BraSizeTable, ClothingSizeTable } from "@/components/SizeCharts";

export const dynamic = "force-dynamic";

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

export default async function SizeGuidePage() {
  const t = await getTexts();
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">דף הבית</Link> ← {t["sizeguide.title"]}
      </div>
      <article className="article">
        <h1>{t["sizeguide.title"]}</h1>
        <p style={{ fontSize: 17.5 }}>{t["sizeguide.intro"]}</p>

        <h3>איך מודדים</h3>
        <ol>
          {lines(t["sizeguide.steps"]).map((x, i) => (
            <li key={i} style={{ marginBottom: 8 }}>{x}</li>
          ))}
        </ol>

        <h3>טבלת חזיות</h3>
        <BraSizeTable />

        <h3>טבלת ביגוד והלבשה תחתונה</h3>
        <ClothingSizeTable />

        <h3>טיפים</h3>
        <ul className="feat" style={{ color: "var(--ink-2)" }}>
          {lines(t["sizeguide.tips"]).map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>

        <div style={{ background: "var(--bg-2)", borderRadius: 14, padding: 18, marginTop: 26 }}>
          <b>עדיין לא בטוחה?</b>{" "}
          <Link href="/quiz" style={{ color: "var(--violet)", fontWeight: 600 }}>מלאי את שאלון ההתאמה</Link>
        </div>
      </article>
    </div>
  );
}
