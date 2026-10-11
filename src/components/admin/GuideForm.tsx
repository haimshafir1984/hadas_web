"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type GuideValue = { id?: string; title: string; teaser: string; sections: [string, string][]; steps: string[] };

export default function GuideForm({ initial }: { initial: GuideValue }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const isNew = !initial.id;

  const save = async () => {
    if (!v.title.trim()) return alert("נא להזין כותרת");
    setSaving(true);
    const res = await fetch(isNew ? "/api/admin/guides" : `/api/admin/guides/${v.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    setSaving(false);
    if (!res.ok) return alert((await res.json().catch(() => ({}))).error ?? "שמירה נכשלה");
    router.push("/admin/guides");
    router.refresh();
  };

  const remove = async () => {
    if (!v.id || !confirm(`למחוק את המדריך "${v.title}"?`)) return;
    await fetch(`/api/admin/guides/${v.id}`, { method: "DELETE" });
    router.push("/admin/guides");
    router.refresh();
  };

  const setSection = (i: number, k: 0 | 1, val: string) =>
    setV((c) => ({
      ...c,
      sections: c.sections.map((s, j) => (j === i ? (k === 0 ? [val, s[1]] : [s[0], val]) : s)) as [string, string][],
    }));
  const setStep = (i: number, val: string) => setV((c) => ({ ...c, steps: c.steps.map((s, j) => (j === i ? val : s)) }));

  return (
    <div className="card" style={{ padding: 20, display: "grid", gap: 14, maxWidth: 800 }}>
      <div className="fld">
        <label>כותרת</label>
        <input value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} />
      </div>
      <div className="fld">
        <label>תקציר (מופיע ברשימה ובראש המדריך)</label>
        <textarea rows={3} value={v.teaser} onChange={(e) => setV({ ...v, teaser: e.target.value })} />
      </div>
      <div className="fld">
        <label>פרקים</label>
        {v.sections.map((s, i) => (
          <div key={i} style={{ display: "grid", gap: 6, marginBottom: 10, padding: 10, background: "var(--bg-2)", borderRadius: 10 }}>
            <input placeholder="כותרת הפרק" value={s[0]} onChange={(e) => setSection(i, 0, e.target.value)} />
            <textarea rows={3} placeholder="טקסט" value={s[1]} onChange={(e) => setSection(i, 1, e.target.value)} />
            <button type="button" className="mini" onClick={() => setV({ ...v, sections: v.sections.filter((_, j) => j !== i) })}>
              הסרת פרק
            </button>
          </div>
        ))}
        <button type="button" className="mini" onClick={() => setV({ ...v, sections: [...v.sections, ["", ""]] })}>
          + פרק
        </button>
      </div>
      <div className="fld">
        <label>צעד אחר צעד</label>
        {v.steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input style={{ flex: 1 }} value={s} onChange={(e) => setStep(i, e.target.value)} />
            <button type="button" className="mini" onClick={() => setV({ ...v, steps: v.steps.filter((_, j) => j !== i) })}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="mini" onClick={() => setV({ ...v, steps: [...v.steps, ""] })}>
          + צעד
        </button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-v" disabled={saving} style={{ borderRadius: 10, padding: "9px 18px", fontSize: 14 }} onClick={save}>
          {saving ? "שומר…" : "שמירה"}
        </button>
        {!isNew && (
          <button className="mini" style={{ color: "#b3261e" }} onClick={remove}>
            מחיקה
          </button>
        )}
      </div>
    </div>
  );
}
