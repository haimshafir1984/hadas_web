import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Carousel from "@/components/Carousel";
import { CategoryTile, GuideTile } from "@/components/CategoryTile";
import StageTile from "@/components/StageTile";
import { getTexts } from "@/lib/site-texts";

export const dynamic = "force-dynamic";

const withSubs = { subcategories: { orderBy: { order: "asc" as const } } };

export default async function HomePage() {
  const [bras, under, cloth, circles, guides, t] = await Promise.all([
    prisma.category.findUnique({ where: { id: "bras" }, include: withSubs }),
    prisma.category.findUnique({ where: { id: "under" }, include: withSubs }),
    prisma.category.findUnique({ where: { id: "cloth" }, include: withSubs }),
    prisma.category.findUnique({ where: { id: "circles" }, include: withSubs }),
    prisma.guide.findMany({ orderBy: { order: "asc" } }),
    getTexts(),
  ]);

  const tiles = (cat: typeof bras) =>
    (cat?.subcategories ?? []).map((s) => <CategoryTile key={s.id} name={s.name} href={`/c/${cat!.id}/${s.id}`} />);

  return (
    <div className="wrap home-page">
      <div className="owner">
        <div className="owner-copy">
          <p>
            {t["home.hero.text"].split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
          <div>
            <span className="who">{t["home.hero.who"]}</span> · <Link href="/about">{t["home.hero.link"]}</Link>
          </div>
        </div>
        <div className="owner-pic" aria-hidden="true">
          ה
        </div>
      </div>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="s-intro">
          <h2>{t["home.bras.title"]}</h2>
          <p>{t["home.bras.text"]}</p>
        </div>
        <Carousel>{tiles(bras)}</Carousel>
        <div className="s-cta">
          <Link className="btn-v" href="/c/bras">
            לכל החזיות
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="qteaser">
          <h2>{t["home.quiz.title"]}</h2>
          <p>{t["home.quiz.text"]}</p>
          <Link className="btn" href="/quiz">
            לשאלון
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>{t["home.under.title"]}</h2>
        </div>
        <Carousel>{tiles(under)}</Carousel>
        <div className="s-cta">
          <Link className="btn-o" href="/c/under" style={{ color: "var(--violet)" }}>
            לכל הפריטים
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>{t["home.period.title"]}</h2>
          <p>{t["home.period.text"]}</p>
        </div>
        <div className="s-cta">
          <Link className="btn-v" href="/c/period">
            לתחתוני המחזור שלנו
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>{t["home.cloth.title"]}</h2>
        </div>
        <Carousel>{tiles(cloth)}</Carousel>
        <div className="s-cta">
          <Link className="btn-o" href="/c/cloth" style={{ color: "var(--violet)" }}>
            לכל הפריטים
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>{t["home.circles.title"]}</h2>
          <p>{t["home.circles.text"]}</p>
        </div>
        <div className="stage-grid">
          {(circles?.subcategories ?? []).map((s) => (
            <StageTile key={s.id} name={s.name} />
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>{t["home.guides.title"]}</h2>
          <p>{t["home.guides.text"]}</p>
        </div>
        <Carousel big>
          {guides.map((g) => (
            <GuideTile key={g.id} title={g.title} href={`/guides/${g.id}`} />
          ))}
        </Carousel>
        <div className="s-cta">
          <Link className="btn-o" href="/guides" style={{ color: "var(--violet)" }}>
            לכל המדריכים
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>{t["home.story.title"]}</h2>
          <p>{t["home.story.text"]}</p>
        </div>
        <div className="story-btns">
          <Link className="story-btn" href="/about">
            ה״אני מאמין״ שלי
          </Link>
          <Link className="story-btn" href="/about">
            סיפורים מחיי החנות
          </Link>
          <Link className="story-btn" href="/about">
            אני מסמיקה :)
          </Link>
          <Link className="story-btn" href="/about">
            איך מגיעים לחנות
          </Link>
        </div>
      </section>
    </div>
  );
}
