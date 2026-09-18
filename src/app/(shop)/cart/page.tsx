"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useCartSummary } from "@/lib/useCartSummary";
import { nis } from "@/lib/format";
import ProductPh from "@/components/ProductPh";

export default function CartPage() {
  const { items, removeItem } = useCart();
  const { summary, loading } = useCartSummary();

  if (!items.length) {
    return (
      <div className="wrap empty">
        <h1 style={{ fontSize: 28 }}>הסל ריק</h1>
        <p>
          אפשר להתחיל מ
          <Link href="/c/sale" style={{ color: "var(--violet)", fontWeight: 600 }}>
            מבצעי השבוע
          </Link>{" "}
          או מ
          <Link href="/quiz" style={{ color: "var(--violet)", fontWeight: 600 }}>
            שאלון ההתאמה
          </Link>
          .
        </p>
      </div>
    );
  }

  if (loading || !summary) {
    return <div className="wrap" style={{ padding: "60px 0" }} />;
  }

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">דף הבית</Link> ← סל קניות
      </div>
      <div className="cart">
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 14 }}>סל הקניות ({items.reduce((a, i) => a + i.qty, 0)})</h1>
          {summary.lines.map((line) => (
            <div className="crow" key={line.index}>
              <ProductPh id={line.productId} name={line.name} gradientIndex={line.gradientIndex} imageUrl={line.image} />
              <div>
                <div style={{ fontWeight: 600 }}>{line.name}</div>
                <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
                  מידה {line.size} ·{" "}
                  <span
                    style={{
                      display: "inline-block",
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      background: line.color,
                      border: "1px solid var(--line)",
                      verticalAlign: -1,
                    }}
                  />{" "}
                  · כמות {line.qty}
                </div>
                <button
                  style={{ background: "none", border: 0, padding: 0, marginTop: 6, color: "var(--coral)", fontSize: 13, fontWeight: 600 }}
                  onClick={() => removeItem(line.index)}
                  type="button"
                >
                  הסרה
                </button>
              </div>
              <div className="mono" style={{ fontWeight: 700 }}>
                {nis(line.lineTotal)}
              </div>
            </div>
          ))}
        </div>
        <aside className="sumbox">
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>
            {summary.shipping ? `עוד ${nis(summary.remainingForFreeShipping)} ומשלוח עלינו` : "קיבלת משלוח חינם ✓"}
          </div>
          <div className="prog">
            <i style={{ width: `${summary.progressPct}%` }} />
          </div>
          <div className="sline">
            <span>מוצרים</span>
            <span className="mono">{nis(summary.subtotal)}</span>
          </div>
          <div className="sline">
            <span>משלוח</span>
            <span className="mono">{summary.shipping ? nis(summary.shipping) : "חינם"}</span>
          </div>
          <div className="stot">
            <span>סה״כ</span>
            <span className="mono">{nis(summary.total)}</span>
          </div>
          <Link className="btn-v" style={{ display: "block", textAlign: "center", marginTop: 14, borderRadius: 12 }} href="/checkout">
            מעבר לתשלום
          </Link>
          <p style={{ fontSize: 12.5, color: "var(--ink-2)", textAlign: "center", margin: "10px 0 0" }}>
            תשלום מאובטח · אשראי / ביט / פייפאל
          </p>
        </aside>
      </div>
    </div>
  );
}
