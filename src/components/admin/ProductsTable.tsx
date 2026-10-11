"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gradientFor, nis } from "@/lib/format";

export type AdminProductRow = {
  id: string;
  sku: string | null;
  name: string;
  badge: string | null;
  categoryId: string;
  categoryName: string;
  subcategoryName: string | null;
  price: number;
  wasPrice: number | null;
  stock: number;
  sizesCount: number;
  gradientIndex: number;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

const PAGE = 100;
const fieldStyle = {
  padding: "9px 12px",
  border: "1px solid var(--line)",
  borderRadius: 10,
  background: "var(--bg)",
  color: "var(--ink)",
  font: "inherit",
} as const;

export default function ProductsTable({
  rows,
  categories,
}: {
  rows: AdminProductRow[];
  categories: { id: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (cat && r.categoryId !== cat) return false;
      if (status === "hidden" && r.isActive) return false;
      if (status === "active" && !r.isActive) return false;
      if (status === "low" && r.stock > 6) return false;
      if (status === "noimg" && r.imageUrl) return false;
      if (!q) return true;
      return (r.name + " " + (r.subcategoryName ?? "") + " " + (r.sku ?? "")).toLowerCase().includes(q);
    });
  }, [rows, query, cat, status]);

  const shown = filtered.slice(0, limit);
  const allShownSelected = shown.length > 0 && shown.every((r) => sel.has(r.id));

  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const bulk = async (payload: Record<string, unknown>, ids = Array.from(sel)) => {
    setBusy(true);
    const res = await fetch("/api/admin/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, ids }),
    });
    setBusy(false);
    if (!res.ok) {
      alert((await res.json().catch(() => ({}))).error ?? "הפעולה נכשלה");
      return false;
    }
    setSel(new Set());
    router.refresh();
    return true;
  };

  const remove = async (row: AdminProductRow) => {
    if (!confirm(`למחוק את "${row.name}" מהקטלוג?`)) return;
    await fetch(`/api/admin/products/${row.id}`, { method: "DELETE" });
    router.refresh();
  };

  const duplicate = async (row: AdminProductRow) => {
    const res = await fetch(`/api/admin/products/${row.id}/duplicate`, { method: "POST" });
    if (!res.ok) return alert("שכפול נכשל");
    const { id } = await res.json();
    router.push(`/admin/products/${id}/edit`);
  };

  const bulkDelete = () => {
    if (confirm(`למחוק ${sel.size} מוצרים לצמיתות? אי אפשר לבטל.`)) bulk({ action: "delete" });
  };

  const bulkPrice = () => {
    const v = prompt("שינוי מחיר באחוזים לכל המוצרים שנבחרו.\nלדוגמה: -10 להורדה של 10%, 5 להעלאה של 5%.");
    if (v == null) return;
    const value = Number(v);
    if (!value) return alert("ערך לא תקין");
    const keepWas = value < 0 && confirm("להציג את המחיר הקודם מחוק (כמבצע)?");
    bulk({ action: "price", mode: "percent", value, keepWas });
  };

  const bulkCategory = () => {
    const names = categories.map((c, i) => `${i + 1}. ${c.name}`).join("\n");
    const v = prompt(`להעביר ${sel.size} מוצרים לאיזו קטגוריה? (תת-קטגוריה תתאפס)\n${names}\nהקלידי מספר:`);
    const c = categories[Number(v) - 1];
    if (c) bulk({ action: "category", categoryId: c.id });
  };

  const setOrder = async (row: AdminProductRow, value: string) => {
    if (Number(value) === row.sortOrder) return;
    await bulk({ action: "sort", value: Number(value) || 0 }, [row.id]);
  };

  return (
    <div className="panel">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <input
          placeholder="חיפוש לפי שם, תת-קטגוריה או מק״ט…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ ...fieldStyle, width: "100%", maxWidth: 300 }}
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={fieldStyle}>
          <option value="">כל הקטגוריות</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={fieldStyle}>
          <option value="">כל המוצרים</option>
          <option value="active">מוצגים בחנות</option>
          <option value="hidden">מוסתרים</option>
          <option value="low">מלאי נמוך (6 ומטה)</option>
          <option value="noimg">בלי תמונה</option>
        </select>
        <span style={{ alignSelf: "center", color: "var(--ink-2)", fontSize: 14 }}>{filtered.length} מוצרים</span>
      </div>

      {sel.size > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", background: "var(--bg-2)", padding: 10, borderRadius: 10, marginBottom: 12 }}>
          <b>{sel.size} נבחרו</b>
          <button className="mini" disabled={busy} onClick={() => bulk({ action: "hide" })} type="button">הסתרה</button>
          <button className="mini" disabled={busy} onClick={() => bulk({ action: "show" })} type="button">הצגה</button>
          <button className="mini" disabled={busy} onClick={bulkPrice} type="button">שינוי מחיר באחוזים</button>
          <button className="mini" disabled={busy} onClick={bulkCategory} type="button">העברת קטגוריה</button>
          <button className="mini dang" disabled={busy} onClick={bulkDelete} type="button">מחיקה</button>
          <button className="mini" onClick={() => setSel(new Set())} type="button">ביטול בחירה</button>
        </div>
      )}

      <div className="tw">
        <table className="atable">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allShownSelected}
                  onChange={(e) =>
                    setSel((s) => {
                      const n = new Set(s);
                      shown.forEach((r) => (e.target.checked ? n.add(r.id) : n.delete(r.id)));
                      return n;
                    })
                  }
                  aria-label="בחירת הכול"
                />
              </th>
              <th></th>
              <th>שם</th>
              <th>קטגוריה</th>
              <th>תת-קטגוריה</th>
              <th>מחיר</th>
              <th>מלאי</th>
              <th title="מספר נמוך מוצג קודם בחנות">סדר</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => {
              const [from, to] = gradientFor(p.gradientIndex, p.id);
              return (
                <tr key={p.id} style={p.isActive ? undefined : { opacity: 0.55 }}>
                  <td>
                    <input type="checkbox" checked={sel.has(p.id)} onChange={() => toggle(p.id)} aria-label={`בחירת ${p.name}`} />
                  </td>
                  <td>
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="thumb" src={p.imageUrl} alt={p.name} />
                    ) : (
                      <div className="thumb" style={{ background: `linear-gradient(140deg, ${from}, ${to})` }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {p.name} {p.badge && <span className="pillst st-new">{p.badge}</span>}
                    {!p.isActive && <span className="pillst"> מוסתר</span>}
                    {p.sku && <div className="mono" style={{ fontSize: 12, color: "var(--ink-2)", fontWeight: 400 }}>{p.sku}</div>}
                  </td>
                  <td>{p.categoryName}</td>
                  <td>{p.subcategoryName ?? "—"}</td>
                  <td className="mono">
                    {nis(p.price)}
                    {p.wasPrice && (
                      <div style={{ fontSize: 12, color: "var(--ink-2)", textDecoration: "line-through" }}>{nis(p.wasPrice)}</div>
                    )}
                  </td>
                  <td className="mono" style={p.stock <= 6 ? { color: "var(--coral)", fontWeight: 700 } : undefined}>
                    {p.stock}
                  </td>
                  <td>
                    <input
                      type="number"
                      defaultValue={p.sortOrder}
                      onBlur={(e) => setOrder(p, e.target.value)}
                      style={{ ...fieldStyle, width: 64, padding: "5px 8px" }}
                      aria-label="סדר תצוגה"
                    />
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <Link className="mini" href={`/admin/products/${p.id}/edit`}>
                      עריכה
                    </Link>{" "}
                    <button className="mini" onClick={() => duplicate(p)} type="button">
                      שכפול
                    </button>{" "}
                    <Link className="mini" href={`/p/${p.id}`}>
                      תצוגה
                    </Link>{" "}
                    <button className="mini dang" onClick={() => remove(p)} type="button">
                      מחיקה
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length > limit && (
        <div style={{ marginTop: 14 }}>
          <button className="mini" onClick={() => setLimit(limit + PAGE)} type="button">
            הצגת עוד ({filtered.length - limit})
          </button>
        </div>
      )}
    </div>
  );
}
