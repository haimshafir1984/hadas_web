"use client";

import { useState } from "react";
import Link from "next/link";

type Row = { line: number; sku: string; name: string; action: "create" | "update" | "error"; errors: string[]; warnings: string[] };
type Preview = { rows: Row[]; summary: { create: number; update: number; error: number } };

const LABEL = { create: "חדש", update: "עדכון", error: "שגיאה" } as const;

export default function ImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function send(mode: "preview" | "commit") {
    if (!file) return;
    setBusy(true);
    setMsg(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("mode", mode);
    try {
      const res = await fetch("/api/admin/import", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "שגיאה");
      if (mode === "preview") setPreview(json);
      else {
        setPreview(null);
        setFile(null);
        setMsg(`הייבוא הסתיים: ${json.created} מוצרים חדשים, ${json.updated} עודכנו${json.skipped ? `, ${json.skipped} שורות דולגו בגלל שגיאות` : ""}.`);
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "שגיאה");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 18, maxWidth: 900 }}>
      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ margin: "0 0 8px" }}>1. הורדת קובץ</h3>
        <p style={{ margin: "0 0 12px", color: "var(--ink-2)" }}>
          תבנית ריקה עם הוראות ורשימת הקטגוריות, או ייצוא של כל המוצרים הקיימים (לעריכה המונית והעלאה מחדש).
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="btn-v" style={{ borderRadius: 10, padding: "9px 18px", fontSize: 14 }} href="/api/admin/import/template">
            הורדת תבנית אקסל
          </a>
          <a className="mini" href="/api/admin/import/export">
            ייצוא המוצרים הקיימים
          </a>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <h3 style={{ margin: "0 0 8px" }}>2. העלאה ובדיקה</h3>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setPreview(null);
            setMsg(null);
          }}
        />
        <div style={{ marginTop: 12 }}>
          <button className="btn-v" disabled={!file || busy} style={{ borderRadius: 10, padding: "9px 18px", fontSize: 14 }} onClick={() => send("preview")}>
            {busy && !preview ? "בודק…" : "בדיקה לפני ייבוא"}
          </button>
        </div>
      </div>

      {msg && (
        <div className="card" style={{ padding: 14, borderColor: "var(--violet)" }}>
          {msg} <Link href="/admin/products" style={{ color: "var(--violet)" }}>למוצרים</Link> · <Link href="/admin/import/images" style={{ color: "var(--violet)" }}>להעלאת תמונות</Link>
        </div>
      )}

      {preview && (
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 8px" }}>3. אישור</h3>
          <p style={{ margin: "0 0 12px" }}>
            {preview.summary.create} חדשים · {preview.summary.update} יעודכנו · {preview.summary.error} עם שגיאות
            {preview.summary.error > 0 && " (שורות עם שגיאות לא ייובאו — אפשר לתקן בקובץ ולהעלות שוב)"}
          </p>
          <div className="tw" style={{ maxHeight: 420, overflow: "auto" }}>
            <table className="atable">
              <thead>
                <tr>
                  <th>שורה</th>
                  <th>מק״ט</th>
                  <th>שם</th>
                  <th>פעולה</th>
                  <th>הערות</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((r) => (
                  <tr key={r.line}>
                    <td>{r.line}</td>
                    <td className="mono">{r.sku}</td>
                    <td>{r.name}</td>
                    <td style={{ color: r.action === "error" ? "#b3261e" : undefined, fontWeight: 600 }}>{LABEL[r.action]}</td>
                    <td style={{ fontSize: 13 }}>
                      {r.errors.map((e, i) => (
                        <div key={i} style={{ color: "#b3261e" }}>{e}</div>
                      ))}
                      {r.warnings.map((w, i) => (
                        <div key={i} style={{ color: "var(--ink-2)" }}>{w}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 14 }}>
            <button
              className="btn-v"
              disabled={busy || preview.summary.create + preview.summary.update === 0}
              style={{ borderRadius: 10, padding: "9px 18px", fontSize: 14 }}
              onClick={() => send("commit")}
            >
              {busy ? "מייבא…" : `ייבוא ${preview.summary.create + preview.summary.update} מוצרים`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
