import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductCardData } from "@/lib/types";
import type { CategoryLite } from "./SketchGallery";

const QUOTES: Record<number, string> = {
  1: "״שמונה מתוך עשר נשים לובשות מידה לא נכונה — בדרך כלל היקף גדול מדי וגביע קטן מדי.״ — מתוך המדריך שלנו למדידה",
};

export default function SketchCategory({
  concept,
  categories,
  categoryName,
  categoryBlurb,
  products,
}: {
  concept: number;
  categories: { bras: CategoryLite };
  categoryName: string;
  categoryBlurb: string;
  products: ProductCardData[];
}) {
  const subs = categories.bras?.subcategories ?? [];

  return (
    <div className="wrap category-page category-page-modern sk-page">
      {concept === 2 && <div className="sk-line-path" aria-hidden="true" />}
      {concept === 3 && <div className="sk-texture" aria-hidden="true" />}

      <div className="crumb">
        <Link href="/sketches">דף הבית</Link> ← {categoryName}
      </div>

      {concept === 4 && (
        <div className="sk-quicknav">
          <span>קפיצה מהירה:</span>
          {subs.slice(0, 6).map((s) => (
            <a key={s.id} href="#">
              {s.name}
            </a>
          ))}
          <Link href="/sketches" className="sk-quicknav-cta">
            מדריך מידות ←
          </Link>
          <Link href="/sketches" className="sk-quicknav-cta">
            שאלון התאמה ←
          </Link>
        </div>
      )}

      <div className="cathead">
        <div>
          <h1>{categoryName}</h1>
          <p style={{ color: "var(--ink-2)", margin: "6px 0 0", maxWidth: "56ch" }}>{categoryBlurb}</p>
          {concept === 1 && <p className="sk-quote">{QUOTES[1]}</p>}
        </div>
        <span className="count">{products.length} פריטים · מיון: הכי נמכרים ▾</span>
      </div>

      <div className="filters">
        <Link className="fchip on" href="/sketches">
          הכול
        </Link>
        {subs.map((s) => (
          <Link key={s.id} className="fchip" href="/sketches">
            {s.name}
          </Link>
        ))}
      </div>

      <div className="grid" style={{ paddingBottom: 60 }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {concept === 4 && (
        <div className="qteaser" style={{ marginBottom: 40 }}>
          <h2>לא בטוחה איזו מידה?</h2>
          <p>שאלון של 3 דקות שממליץ לך על דגמים לפי התשובות שלך.</p>
          <Link className="btn" href="/sketches">
            לשאלון
          </Link>
        </div>
      )}
    </div>
  );
}
