"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Def = { key: string; label: string; values: string[] };

export default function ListsForm({ defs }: { defs: Def[] }) {
  const router = useRouter();
  const [text, setText] = useState<Record<string, string>>(Object.fromEntries(defs.map((d) => [d.key, d.values.join("\n")])));
  const [msg, setMsg] = useState("");

  const save = async () => {
    const body = Object.fromEntries(Object.entries(text).map(([k, v]) => [k, v.split("\n").map((x) => x.trim()).filter(Boolean)]));
    const res = await fetch("/api/admin/lists", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setMsg(res.ok ? "נשמר ✓" : "שמירה נכשלה");
    if (res.ok) router.refresh();
    setTimeout(() => setMsg(""), 2500);
  };

  return (
    <>
      <p style={{ color: "var(--ink-2)", marginTop: 0 }}>
        הרשימות האלה מופיעות כתפריטי בחירה בקובץ האקסל (גיליון &quot;רשימות&quot;) ובודקות את הנתונים בזמן הייבוא. ערך אחד בכל שורה. הקטגוריות והצבעים נלקחים אוטומטית מהאתר.
      </p>
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {defs.map((d) => (
          <div className="panel" key={d.key} style={{ margin: 0 }}>
            <h3>{d.label}</h3>
            <textarea
              rows={10}
              style={{ width: "100%" }}
              value={text[d.key]}
              onChange={(e) => setText((t) => ({ ...t, [d.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn-v" style={{ borderRadius: 11 }} onClick={save} type="button">
          שמירה
        </button>{" "}
        {msg}
      </div>
    </>
  );
}
