import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guide = await prisma.guide.findUnique({ where: { id } });
  if (!guide) notFound();

  const sections = (guide.sections as unknown as [string, string][]) ?? [];

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">דף הבית</Link> ← <Link href="/guides">מדריכים</Link> ← {guide.title}
      </div>
      <article className="article">
        <h1>{guide.title}</h1>
        <p style={{ fontSize: 17.5 }}>{guide.teaser}</p>
        <div
          className="ph"
          style={{ aspectRatio: "16/9", borderRadius: 14, marginBlock: 20, background: "linear-gradient(140deg,#3B2352,#7A4C9E)" }}
        >
          <span className="glyph" style={{ fontSize: 18 }}>
            {guide.title}
          </span>
        </div>
        {sections.map(([heading, text], i) => (
          <div key={i}>
            <h3>{heading}</h3>
            <p>{text}</p>
          </div>
        ))}
        <h3>צעד אחר צעד</h3>
        <ol>
          {guide.steps.map((s, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              {s}
            </li>
          ))}
        </ol>
        <div style={{ background: "var(--bg-2)", borderRadius: 14, padding: 18, marginTop: 26 }}>
          <b>עדיין לא בטוחה?</b>{" "}
          <Link href="/quiz" style={{ color: "var(--violet)", fontWeight: 600 }}>
            מלאי את שאלון ההתאמה
          </Link>{" "}
          או כתבי לנו בוואטסאפ — עונה בן אדם.
        </div>
      </article>
    </div>
  );
}
