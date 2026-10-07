"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LineIcon from "../LineIcon";

type Sub = { id: string; name: string; iconUrl: string | null };

export default function SubcategoryManager({ categoryId, subs }: { categoryId: string; subs: Sub[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const add = async () => {
    if (!name.trim()) return;
    const res = await fetch(`/api/admin/categories/${categoryId}/subcategories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName("");
      router.refresh();
    }
  };

  const remove = async (subId: string) => {
    await fetch(`/api/admin/categories/${categoryId}/subcategories/${subId}`, { method: "DELETE" });
    router.refresh();
  };

  const setIcon = async (subId: string, iconUrl: string | null) => {
    const res = await fetch(`/api/admin/categories/${categoryId}/subcategories/${subId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iconUrl }),
    });
    if (!res.ok) throw new Error("שמירת האייקון נכשלה");
  };

  const upload = async (subId: string, files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusyId(subId);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.urls?.[0]) throw new Error(data.error ?? "העלאת האייקון נכשלה");
      await setIcon(subId, data.urls[0]);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "העלאת האייקון נכשלה");
    } finally {
      setBusyId(null);
      const input = fileInputs.current[subId];
      if (input) input.value = "";
    }
  };

  const reset = async (subId: string) => {
    setBusyId(subId);
    setError("");
    try {
      await setIcon(subId, null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "שמירת האייקון נכשלה");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="panel">
      <h3>תת-קטגוריות ({subs.length})</h3>
      <p style={{ color: "var(--ink-2)", fontSize: 13, margin: "0 0 12px" }}>
        אייקון: PNG או SVG ריבועי (עד 512×512) על רקע שקוף — מוצג בצבעים המקוריים שלו. אפשר גם JPG עם רקע לבן. בלי העלאה מוצג אייקון ברירת המחדל.
      </p>
      {error && <div className="err">{error}</div>}
      {subs.length ? (
        <div className="sub-rows">
          {subs.map((s) => (
            <div className="sub-row" key={s.id}>
              <span className="sub-row-icon">
                <LineIcon name={s.name} size={34} iconUrl={s.iconUrl} />
              </span>
              <span className="sub-row-name">{s.name}</span>
              <input
                ref={(el) => {
                  fileInputs.current[s.id] = el;
                }}
                type="file"
                accept="image/svg+xml,image/png,image/webp,image/jpeg"
                hidden
                onChange={(e) => upload(s.id, e.target.files)}
              />
              <button
                type="button"
                className="mini"
                disabled={busyId === s.id}
                onClick={() => fileInputs.current[s.id]?.click()}
              >
                {busyId === s.id ? "מעלה…" : s.iconUrl ? "החלפת אייקון" : "העלאת אייקון"}
              </button>
              {s.iconUrl && (
                <button type="button" className="mini" disabled={busyId === s.id} onClick={() => reset(s.id)}>
                  חזרה לברירת מחדל
                </button>
              )}
              <button type="button" className="mini dang" onClick={() => remove(s.id)} aria-label={`מחיקת ${s.name}`}>
                מחיקה
              </button>
            </div>
          ))}
        </div>
      ) : (
        <span style={{ color: "var(--ink-2)" }}>אין עדיין תת-קטגוריות.</span>
      )}
      <div className="rowin" style={{ maxWidth: 480, marginTop: 14 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="שם תת-קטגוריה"
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="mini" onClick={add} type="button">
          הוספה
        </button>
      </div>
    </div>
  );
}
