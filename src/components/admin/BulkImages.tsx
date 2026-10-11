"use client";

import { useState } from "react";

type Item = { file: File; sku: string; idx: number; status: "ready" | "ok" | "no-product" | "error" };

// "BR-1001.jpg" -> BR-1001 / 0 ; "BR-1001_2.jpg" -> BR-1001 / 1
function parseName(name: string) {
  const base = name.replace(/\.[^.]+$/, "");
  const m = base.match(/^(.*?)[_ ]+(\d+)$/);
  return m ? { sku: m[1].trim(), idx: Number(m[2]) - 1 } : { sku: base.trim(), idx: 0 };
}

async function shrink(file: File): Promise<File> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob: Blob | null = await new Promise((r) => c.toBlob(r, "image/webp", 0.85));
    return blob ? new File([blob], "image.webp", { type: "image/webp" }) : file;
  } catch {
    return file;
  }
}

export default function BulkImages() {
  const [items, setItems] = useState<Item[]>([]);
  const [replace, setReplace] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);

  function pick(files: FileList | null) {
    if (!files) return;
    setItems(
      Array.from(files)
        .map((file) => ({ file, ...parseName(file.name), status: "ready" as const }))
        .sort((a, b) => a.sku.localeCompare(b.sku) || a.idx - b.idx),
    );
    setDone(0);
  }

  async function run() {
    setBusy(true);
    setDone(0);
    const bySku = new Map<string, Item[]>();
    items.forEach((it) => bySku.set(it.sku, [...(bySku.get(it.sku) ?? []), it]));
    const next = [...items];
    for (const [sku, group] of bySku) {
      try {
        const urls: string[] = [];
        for (const it of group) {
          const fd = new FormData();
          fd.append("file", await shrink(it.file));
          const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const j = await up.json();
          if (!up.ok) throw new Error(j.error || "upload");
          urls.push(j.urls[0]);
        }
        const res = await fetch("/api/admin/import/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sku, urls, replace }),
        });
        const status = res.ok ? "ok" : res.status === 404 ? "no-product" : "error";
        group.forEach((it) => (next[next.indexOf(it)] = { ...it, status }));
      } catch {
        group.forEach((it) => (next[next.indexOf(it)] = { ...it, status: "error" }));
      }
      setDone((d) => d + group.length);
      setItems([...next]);
    }
    setBusy(false);
  }

  const LABEL = { ready: "ממתין", ok: "הועלה", "no-product": "אין מוצר עם מק״ט כזה", error: "שגיאה" };

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 800 }}>
      <div className="card" style={{ padding: 18 }}>
        <p style={{ margin: "0 0 12px", color: "var(--ink-2)" }}>
          בחרי הרבה תמונות בבת אחת. שם הקובץ קובע לאיזה מוצר הן שייכות: <b>BR-1001.jpg</b> לתמונה הראשית, <b>BR-1001_2.jpg</b>, <b>BR-1001_3.jpg</b> לתמונות נוספות. התמונות מוקטנות אוטומטית.
        </p>
        <input type="file" accept="image/*" multiple onChange={(e) => pick(e.target.files)} />
        <label style={{ display: "block", margin: "12px 0" }}>
          <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} /> להחליף תמונות קיימות של המוצר (אחרת מוסיף בסוף)
        </label>
        <button className="btn-v" disabled={!items.length || busy} style={{ borderRadius: 10, padding: "9px 18px", fontSize: 14 }} onClick={run}>
          {busy ? `מעלה… ${done}/${items.length}` : `העלאת ${items.length} תמונות`}
        </button>
      </div>
      {items.length > 0 && (
        <div className="tw" style={{ maxHeight: 420, overflow: "auto" }}>
          <table className="atable">
            <thead>
              <tr>
                <th>קובץ</th>
                <th>מק״ט</th>
                <th>מקום</th>
                <th>מצב</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>{it.file.name}</td>
                  <td className="mono">{it.sku}</td>
                  <td>{it.idx + 1}</td>
                  <td style={{ color: it.status === "ok" ? "#0e8f6f" : it.status === "ready" ? undefined : "#b3261e" }}>{LABEL[it.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
