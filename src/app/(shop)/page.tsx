import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Carousel from "@/components/Carousel";
import { CategoryTile, GuideTile } from "@/components/CategoryTile";
import StageTile from "@/components/StageTile";
import { CIRCLES_STAGE_BLURBS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [bras, under, cloth, circles, guides] = await Promise.all([
    prisma.category.findUnique({ where: { id: "bras" }, include: { subcategories: { orderBy: { order: "asc" } } } }),
    prisma.category.findUnique({ where: { id: "under" }, include: { subcategories: { orderBy: { order: "asc" } } } }),
    prisma.category.findUnique({ where: { id: "cloth" }, include: { subcategories: { orderBy: { order: "asc" } } } }),
    prisma.category.findUnique({ where: { id: "circles" }, include: { subcategories: { orderBy: { order: "asc" } } } }),
    prisma.guide.findMany({ orderBy: { order: "asc" } }),
  ]);

  const brasSubs = (bras?.subcategories ?? []).slice(0, 5);
  const underSubs = (under?.subcategories ?? []).slice(0, 4);
  const clothSubs = (cloth?.subcategories ?? []).slice(0, 4);
  const stages = circles?.subcategories ?? [];

  return (
    <div className="wrap home-page">
      <div className="owner">
        <span className="hero-kicker">התאמה אישית · נוחות · ביטחון</span>
        <div className="owner-pic">ה</div>
        <p>
          שלום, אני הדס והאושר שלי בחיים זה פרפר סגול. אני חיה את עולם החזיות והבגדים, ואני רואה בזה שליחות — למצוא
          לכל אישה בדיוק את המידה שמתאימה לה.
          <br />
          ברוכה הבאה לאתר שלי, אני שמחה כל כך שהגעת!
        </p>
        <div>
          <span className="who">הדס, בעלת פרפר סגול</span> · <Link href="/about">לקרוא את הסיפור המלא</Link>
        </div>
        <div className="hero-actions">
          <Link className="btn-v" href="/c/bras">
            למצוא את החזייה שלי
          </Link>
          <Link className="btn-o" href="/quiz">
            לא יודעת מה מתאים לי?
          </Link>
        </div>
      </div>

      <div className="home-benefits" aria-label="היתרונות של פרפר סגול">
        <div className="home-benefit">
          <span className="home-benefit-icon">✦</span>
          <div><strong>ייעוץ אישי</strong><span>מישהי אמיתית שמקשיבה</span></div>
        </div>
        <div className="home-benefit">
          <span className="home-benefit-icon">✓</span>
          <div><strong>בחירה בטוחה</strong><span>מידות, גזרות והכוונה ברורה</span></div>
        </div>
        <div className="home-benefit">
          <span className="home-benefit-icon">♡</span>
          <div><strong>נוחות לאורך היום</strong><span>בדים נעימים וגזרות צנועות</span></div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="s-intro">
          <h2>חזיות</h2>
          <p>חזיות זה לא בגד שקונים סתם. זה בגד עם רגש, עם אהבה — ואנחנו כאן שתמצאי את שלך.</p>
        </div>
        <Carousel>
          {brasSubs.map((s) => (
            <CategoryTile key={s.id} name={s.name} href="/c/bras" />
          ))}
        </Carousel>
        <div className="s-cta">
          <Link className="btn-v" href="/c/bras">
            לכל החזיות
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="qteaser">
          <h2>שאלון התאמת חזייה</h2>
          <p>שיטה ייחודית להתאמת חזייה ע״י שאלון מרחוק — למי שלא יודעת מה נכון לה.</p>
          <Link className="btn" href="/quiz">
            לשאלון
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>הלבשה תחתונה</h2>
        </div>
        <Carousel>
          {underSubs.map((s) => (
            <CategoryTile key={s.id} name={s.name} href="/c/under" />
          ))}
        </Carousel>
        <div className="s-cta">
          <Link className="btn-o" href="/c/under">
            לכל הפריטים
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>תחתוני מחזור</h2>
          <p>ספיגה מדורגת, כותנה נעימה, בלי תחושת מוצר רפואי — ליום שלם בלי לחשוב על זה פעם נוספת.</p>
        </div>
        <div className="s-cta">
          <Link className="btn-v" href="/c/period">
            לתחתוני המחזור שלנו
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>ביגוד</h2>
        </div>
        <Carousel>
          {clothSubs.map((s) => (
            <CategoryTile key={s.id} name={s.name} href="/c/cloth" />
          ))}
        </Carousel>
        <div className="s-cta">
          <Link className="btn-o" href="/c/cloth">
            לכל הפריטים
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>מעגלי החיים</h2>
          <p>הגוף משתנה — והמלאי אצלנו מסודר לפי השלב שאת בו, לא רק לפי המידה שרשומה בתווית.</p>
        </div>
        <div className="stage-grid">
          {stages.map((s, i) => (
            <StageTile key={s.id} name={s.name} blurb={CIRCLES_STAGE_BLURBS[i] ?? ""} index={i} />
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>מדריכים</h2>
          <p>מה שאנחנו מסבירות בחנות עשר פעמים ביום, כתוב — בלי מונחים מקצועיים ובלי לנסות למכור לך משהו.</p>
        </div>
        <Carousel big>
          {guides.map((g) => (
            <GuideTile key={g.id} title={g.title} href={`/guides/${g.id}`} />
          ))}
        </Carousel>
        <div className="s-cta">
          <Link className="btn-o" href="/guides">
            לכל המדריכים
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="s-intro">
          <h2>הסיפור של פרפר סגול</h2>
          <p>למה פתחנו את החנות, ולמה אנחנו עדיין מאמינות שמדידה טובה שווה יותר מכל מבצע.</p>
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
