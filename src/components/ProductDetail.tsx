"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { discountPct, nis } from "@/lib/format";
import ProductPh from "./ProductPh";
import ProductCard from "./ProductCard";
import TiltCard from "./TiltCard";
import { BraSizeTable, ClothingSizeTable } from "./SizeCharts";
import { CheckIcon } from "./icons";
import type { ProductCardData } from "@/lib/types";

export type ProductDetailData = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  wasPrice: number | null;
  rating: number;
  ratingCount: number;
  stock: number;
  description: string | null;
  features: string[];
  colors: string[];
  sizes: string[];
  outOfStockSizes: string[];
  badge: string | null;
  gradientIndex: number;
  images: { url: string }[];
};

export default function ProductDetail({
  product,
  related,
}: {
  product: ProductDetailData;
  related: ProductCardData[];
}) {
  const firstAvailableSize = product.sizes.find((s) => !product.outOfStockSizes.includes(s)) ?? product.sizes[0];
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(firstAvailableSize);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const { addItem } = useCart();
  const { show } = useToast();

  const off = discountPct(product.price, product.wasPrice);
  const low = product.stock <= 6;
  const isBra = product.categoryId === "bras" && product.sizes.length > 6;

  const doAdd = () => {
    if (!size) {
      show("נא לבחור מידה");
      return;
    }
    addItem(product.id, size, color, qty);
    show("נוסף לסל ✓");
  };

  useEffect(() => {
    const el = document.getElementById("sticky-buy");
    if (el) el.classList.add("show");
    return () => {
      if (el) el.classList.remove("show");
    };
  }, []);

  const image = product.images[0]?.url;

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">דף הבית</Link> ← <Link href={`/c/${product.categoryId}`}>{product.categoryName}</Link> ←{" "}
        {product.name}
      </div>
      <div className="pdp">
        <div className="gal">
          <TiltCard className="tilt-hero">
            <ProductPh id={product.id} name={product.name} gradientIndex={product.gradientIndex} imageUrl={image} />
          </TiltCard>
          <ProductPh id={product.id} name={product.name} gradientIndex={product.gradientIndex} imageUrl={image} />
          <ProductPh id={product.id} name={product.name} gradientIndex={product.gradientIndex} imageUrl={image} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 500 }}>{product.categoryName}</div>
          <h1>{product.name}</h1>
          {product.ratingCount ? (
            <div className="stars" style={{ marginTop: 6 }}>
              {"★".repeat(Math.round(product.rating))}
              <span>
                {product.rating} · {product.ratingCount} חוות דעת
              </span>
            </div>
          ) : null}
          <div className="pricebox">
            <span className="now mono">{nis(product.price)}</span>
            {product.wasPrice ? (
              <>
                <span className="was mono" style={{ textDecoration: "line-through", color: "var(--ink-2)" }}>
                  {nis(product.wasPrice)}
                </span>
                <span className="off">{off}% הנחה</span>
              </>
            ) : null}
          </div>
          <div className="pay">3 תשלומים ללא ריבית · {nis(Math.round(product.price / 3))} לחודש · אשראי, ביט או פייפאל</div>
          <div className={`stock ${low ? "low" : ""}`}>
            <span className="dot" />
            {low ? `נותרו ${product.stock} יחידות במלאי` : "במלאי — נשלח תוך יום עסקים"}
          </div>
          <p style={{ color: "var(--ink-2)", marginTop: 12 }}>{product.description}</p>

          <div className="lbl">
            <span>צבע</span>
          </div>
          <div className="swatches">
            {product.colors.map((c, i) => (
              <button
                key={c + i}
                className={`sw ${color === c ? "on" : ""}`}
                style={{ background: c }}
                aria-label={`צבע ${i + 1}`}
                onClick={() => setColor(c)}
                type="button"
              />
            ))}
          </div>

          <div className="lbl">
            <span>מידה</span>
            <Link href="/size-guide">מדריך מידות ←</Link>
          </div>
          <div className="sizes">
            {product.sizes.map((s) => {
              const out = product.outOfStockSizes.includes(s);
              return (
                <button
                  key={s}
                  className={`size ${out ? "out" : ""} ${size === s && !out ? "on" : ""}`}
                  disabled={out}
                  onClick={() => setSize(s)}
                  type="button"
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="buy">
            <div className="qty">
              <button aria-label="פחות" onClick={() => setQty((q) => Math.max(1, q - 1))} type="button">
                −
              </button>
              <span>{qty}</span>
              <button aria-label="עוד" onClick={() => setQty((q) => q + 1)} type="button">
                +
              </button>
            </div>
            <button className="btn-v" onClick={doAdd} type="button">
              הוספה לסל · {nis(product.price)}
            </button>
          </div>

          <div className="perks">
            <div>
              <CheckIcon />
              <span>החלפה והחזרה תוך 14 יום, גם על פריטי מבצע</span>
            </div>
            <div>
              <CheckIcon />
              <span>ייעוץ מידה חינם בוואטסאפ לפני ההזמנה</span>
            </div>
            <div>
              <CheckIcon />
              <span>איסוף מהחנות בפתח תקווה — חינם, תוך שעתיים</span>
            </div>
          </div>

          <div className="tabs">
            {["מאפיינים", "טבלת מידות", "משלוח והחזרה", `חוות דעת (${product.ratingCount})`].map((t, i) => (
              <button key={t} className={`tab ${tab === i ? "on" : ""}`} onClick={() => setTab(i)} type="button">
                {t}
              </button>
            ))}
          </div>
          <div className={`tabp ${tab === 0 ? "on" : ""}`}>
            <ul className="feat">
              {product.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
          <div className={`tabp ${tab === 1 ? "on" : ""}`}>{isBra ? <BraSizeTable /> : <ClothingSizeTable />}</div>
          <div className={`tabp ${tab === 2 ? "on" : ""}`}>
            משלוח שליח עד הבית ₪29, חינם מעל ₪250. איסוף עצמי מהחנות בפתח תקווה — חינם. החלפה או החזרה תוך 14 יום עם
            תווית מחוברת. תחתונים ובגדי ים אינם ניתנים להחזרה מטעמי היגיינה.
          </div>
          <div className={`tabp ${tab === 3 ? "on" : ""}`}>
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 12, marginBottom: 12 }}>
              <div className="stars">
                ★★★★★ <span>נועה, לפני שבועיים</span>
              </div>
              <p style={{ margin: "4px 0 0" }}>״הזמנתי אחרי שהתייעצתי בוואטסאפ. המידה שהמליצו הייתה בול, בלי החזרה.״</p>
            </div>
            <div>
              <div className="stars">
                ★★★★☆ <span>דנה, לפני חודש</span>
              </div>
              <p style={{ margin: "4px 0 0" }}>״נוחה מאוד, אבל הצבע קצת יותר בהיר מהתמונה.״</p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="sh">
            <h2>לקוחות קנו גם</h2>
          </div>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="stickybuy" id="sticky-buy">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{product.name}</div>
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>{nis(product.price)}</div>
        </div>
        <button className="btn-v" onClick={doAdd} type="button">
          הוספה לסל
        </button>
      </div>
    </div>
  );
}
