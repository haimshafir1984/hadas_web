"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function DoneContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order") ?? "—";

  return (
    <div className="wrap" style={{ maxWidth: 620, textAlign: "center", paddingBlock: 60 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--mint)",
          display: "grid",
          placeItems: "center",
          marginInline: "auto",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1 style={{ fontSize: 30, marginBlock: "16px 8px" }}>ההזמנה התקבלה 🎉</h1>
      <p style={{ color: "var(--ink-2)" }}>
        מספר הזמנה <b>{orderNumber}</b>. שלחנו מייל עם הסיכום ולינק לתשלום מאובטח. אם פריט חסר במלאי — נתקשר או נשלח
        וואטסאפ עם הצעה חלופית, ולא נחייב לפני שתאשרי.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
        <Link className="btn-v" href="/">
          המשך קנייה
        </Link>
        <Link className="btn-o" href="/guides" style={{ color: "var(--violet)" }}>
          מדריך תחזוקה
        </Link>
      </div>
    </div>
  );
}
