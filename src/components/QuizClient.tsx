"use client";

import { useState } from "react";
import Link from "next/link";
import { QUIZ_STEPS } from "@/lib/constants";
import ProductCard from "./ProductCard";
import type { ProductCardData } from "@/lib/types";

export default function QuizClient({ recommended }: { recommended: ProductCardData[] }) {
  const [step, setStep] = useState(0);
  const totalSteps = QUIZ_STEPS.length + 1;

  return (
    <div className="wrap quiz">
      <h1 style={{ fontSize: 30 }}>מצאי את המידה שלך</h1>
      <p style={{ color: "var(--ink-2)" }}>5 שאלות, פחות משלוש דקות. בסוף — שלושה דגמים במקום ארבעים.</p>
      <div className="qbar" style={{ marginTop: 22 }}>
        <i style={{ width: `${Math.min(100, ((step + 1) / totalSteps) * 100)}%` }} />
      </div>

      {QUIZ_STEPS.map((s, i) => (
        <div key={i} className={`q-step ${step === i ? "on" : ""}`}>
          <div style={{ fontSize: 13, color: "var(--ink-2)", fontWeight: 600 }}>
            שאלה {i + 1} מתוך {QUIZ_STEPS.length}
          </div>
          <h2 style={{ fontSize: 24, marginTop: 6 }}>{s.q}</h2>
          <div className="q-opts">
            {s.a.map((a) => (
              <button
                key={a}
                className="q-opt"
                onClick={() => {
                  setStep(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                type="button"
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className={`q-step ${step === QUIZ_STEPS.length ? "on" : ""}`}>
        <div className="result">
          <div style={{ fontSize: 13, fontWeight: 600, color: "#DCC9EE" }}>ההמלצה שלנו</div>
          <h2 style={{ fontSize: 26, marginBlock: "8px 10px" }}>גביע מלא · היקף אחד קטן יותר</h2>
          <p style={{ color: "#E3D2F2", margin: 0 }}>
            לפי התשובות, סביר שההיקף גדול מדי והגביע קטן מדי — הסימן המובהק הוא גב שמטפס. נסי היקף אחד קטן יותר וגביע
            אחד גדול יותר, בגזרת גביע מלא עם גב רחב.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <Link className="btn" href="/c/bras">
              לדגמים המומלצים
            </Link>
            <Link className="btn-o" href="/about" style={{ color: "#fff" }}>
              מדידה בחנות
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 30 }}>
          <div className="sh">
            <h2 style={{ fontSize: 20 }}>שלושה דגמים להתחיל מהם</h2>
          </div>
          <div className="grid">
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
