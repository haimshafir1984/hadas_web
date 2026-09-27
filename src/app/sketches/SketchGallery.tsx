"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProductCardData } from "@/lib/types";
import type { ProductDetailData } from "@/components/ProductDetail";
import SketchHome from "./SketchHome";
import SketchCategory from "./SketchCategory";
import SketchProduct from "./SketchProduct";

export type CategoryLite = {
  id: string;
  name: string;
  blurb: string | null;
  subcategories: { id: string; name: string }[];
} | null;

export type GuideLite = { id: string; title: string };

const CONCEPTS = [
  { n: 1, name: "Atelier נחת", tag: "מגזין / עריכתי" },
  { n: 2, name: "סטודיו קו", tag: "לינאי / גיאומטרי" },
  { n: 3, name: "בית חם", tag: "טקסטיל / ביתי" },
  { n: 4, name: "קטלוג מדויק", tag: "מובנה / ריטייל" },
] as const;

const VIEWS = [
  { k: "home", label: "דף בית" },
  { k: "category", label: "דף קטגוריה" },
  { k: "product", label: "דף מוצר" },
] as const;

type View = (typeof VIEWS)[number]["k"];

export default function SketchGallery(props: {
  categories: { bras: CategoryLite; under: CategoryLite; cloth: CategoryLite; circles: CategoryLite };
  guides: GuideLite[];
  texts: Record<string, string>;
  categoryName: string;
  categoryBlurb: string;
  products: ProductCardData[];
  productDetail: ProductDetailData | null;
  related: ProductCardData[];
}) {
  const [concept, setConcept] = useState(1);
  const [view, setView] = useState<View>("home");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = Number(p.get("concept"));
    const v = p.get("view") as View | null;
    if (c >= 1 && c <= 4) setConcept(c);
    if (v && VIEWS.some((x) => x.k === v)) setView(v);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    p.set("concept", String(concept));
    p.set("view", view);
    window.history.replaceState(null, "", `/sketches?${p.toString()}`);
  }, [concept, view]);

  return (
    <div className="sk-shell">
      <div className="sk-topbar">
        <div className="sk-topbar-row">
          <Link href="/" className="sk-back">
            ← חזרה לאתר
          </Link>
          <div className="sk-title">סקיצות עיצוב · לבדיקה ואישור</div>
        </div>
        <div className="sk-tabs" role="tablist" aria-label="קונספט עיצוב">
          {CONCEPTS.map((c) => (
            <button
              key={c.n}
              type="button"
              className={`sk-tab ${concept === c.n ? "on" : ""}`}
              onClick={() => setConcept(c.n)}
              role="tab"
              aria-selected={concept === c.n}
            >
              <span className="sk-tab-n">{c.n}</span>
              <span className="sk-tab-name">{c.name}</span>
              <span className="sk-tab-tag">{c.tag}</span>
            </button>
          ))}
        </div>
        <div className="sk-subtabs" role="tablist" aria-label="סוג עמוד">
          {VIEWS.map((v) => (
            <button
              key={v.k}
              type="button"
              className={`sk-subtab ${view === v.k ? "on" : ""}`}
              onClick={() => setView(v.k)}
              role="tab"
              aria-selected={view === v.k}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`concept concept-${concept}`} key={`${concept}-${view}`}>
        {view === "home" && <SketchHome concept={concept} {...props} />}
        {view === "category" && <SketchCategory concept={concept} {...props} />}
        {view === "product" && <SketchProduct concept={concept} {...props} />}
      </div>
    </div>
  );
}
