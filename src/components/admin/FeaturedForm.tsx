"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type P = { id: string; name: string; sku: string | null };

function Picker({ title, hint, products, value, onChange }: { title: string; hint: string; products: P[]; value: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  const shown = products.filter((p) => !q || p.name.includes(q) || (p.sku ?? "").toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="panel">
      <h3>{title}</h3>
      <p style={{ color: "var(--ink-2)", marginTop: 0 }}>
        {hint} ({value.length} נבחרו)
      </p>
      <input placeholder="חיפוש לפי שם או מק״ט" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 10, width: "100%" }} />
      <div style={{ maxHeight: 260, overflow: "auto", display: "grid", gap: 4 }}>
        {shown.map((p) => (
          <label key={p.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={value.includes(p.id)}
              onChange={(e) => onChange(e.target.checked ? [...value, p.id] : value.filter((x) => x !== p.id))}
            />
            {p.name} {p.sku && <span style={{ color: "var(--ink-2)", fontSize: 12.5 }}>({p.sku})</span>}
          </label>
        ))}
        {!shown.length && <span style={{ color: "var(--ink-2)" }}>לא נמצאו מוצרים.</span>}
      </div>
    </div>
  );
}

export default function FeaturedForm({
  products,
  initial,
}: {
  products: P[];
  initial: { circles: string[]; quiz: string[]; heroImage: string };
}) {
  const router = useRouter();
  const [circles, setCircles] = useState(initial.circles);
  const [quiz, setQuiz] = useState(initial.quiz);
  const [hero, setHero] = useState(initial.heroImage);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return alert(j.error ?? "העלאה נכשלה");
    setHero(j.urls[0]);
  }

  async function save() {
    const res = await fetch("/api/admin/featured", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ circles, quiz, heroImage: hero }),
    });
    setMsg(res.ok ? "נשמר ✓" : "שמירה נכשלה");
    if (res.ok) router.refresh();
    setTimeout(() => setMsg(""), 2500);
  }

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 800 }}>
      <div className="panel">
        <h3>תמונת פתיחה בדף הבית</h3>
        <p style={{ color: "var(--ink-2)", marginTop: 0 }}>במקום העיגול עם האות. מומלץ תמונה מרובעת.</p>
        {hero && <img src={hero} alt="" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", display: "block", marginBottom: 10 }} />}
        <input type="file" accept="image/*" disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        {hero && (
          <button type="button" className="mini" style={{ marginInlineStart: 10 }} onClick={() => setHero("")}>
            הסרה
          </button>
        )}
      </div>
      <Picker title="מוצרים בעמוד מעגלי החיים" hint="ריק = ברירת המחדל הישנה" products={products} value={circles} onChange={setCircles} />
      <Picker title="מוצרים מומלצים בסוף השאלון" hint="מומלץ 3 מוצרים. ריק = ברירת המחדל הישנה" products={products} value={quiz} onChange={setQuiz} />
      <div>
        <button className="btn-v" style={{ borderRadius: 11 }} onClick={save} type="button">
          שמירה
        </button>{" "}
        {msg}
      </div>
    </div>
  );
}
