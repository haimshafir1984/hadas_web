import Link from "next/link";
import Carousel from "@/components/Carousel";
import { CategoryTile, GuideTile } from "@/components/CategoryTile";
import StageTile from "@/components/StageTile";
import type { CategoryLite, GuideLite } from "./SketchGallery";

export default function SketchHome({
  concept,
  categories,
  guides,
  texts: t,
}: {
  concept: number;
  categories: { bras: CategoryLite; under: CategoryLite; cloth: CategoryLite; circles: CategoryLite };
  guides: GuideLite[];
  texts: Record<string, string>;
}) {
  const { bras, under, cloth, circles } = categories;
  const tiles = (cat: CategoryLite) =>
    (cat?.subcategories ?? []).map((s) => <CategoryTile key={s.id} name={s.name} href={`/sketches`} />);

  return (
    <div className="wrap home-page sk-page">
      {concept === 2 && <div className="sk-line-path" aria-hidden="true" />}
      {concept === 3 && <div className="sk-texture" aria-hidden="true" />}

      <div className="owner">
        {concept === 1 && <span className="sk-kicker">האני-מאמין שלנו</span>}
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
            <span className="who">{t["home.hero.who"]}</span> · <Link href="/sketches">{t["home.hero.link"]}</Link>
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
          <Link className="btn-v" href="/sketches">
            לכל החזיות
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="qteaser">
          <h2>{t["home.quiz.title"]}</h2>
          <p>{t["home.quiz.text"]}</p>
          <Link className="btn" href="/sketches">
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
          <Link className="btn-o" href="/sketches" style={{ color: "var(--violet)" }}>
            לכל הפריטים
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>{t["home.cloth.title"]}</h2>
        </div>
        <Carousel>{tiles(cloth)}</Carousel>
        <div className="s-cta">
          <Link className="btn-o" href="/sketches" style={{ color: "var(--violet)" }}>
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
            <GuideTile key={g.id} title={g.title} href="/sketches" />
          ))}
        </Carousel>
      </section>
    </div>
  );
}
