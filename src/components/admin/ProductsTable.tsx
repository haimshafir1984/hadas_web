"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gradientFor, nis } from "@/lib/format";

export type AdminProductRow = {
  id: string;
  name: string;
  badge: string | null;
  categoryName: string;
  subcategoryName: string | null;
  price: number;
  wasPrice: number | null;
  stock: number;
  sizesCount: number;
  gradientIndex: number;
  imageUrl: string | null;
};

export default function ProductsTable({ rows }: { rows: AdminProductRow[] }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => (r.name + " " + (r.subcategoryName ?? "")).toLowerCase().includes(q));
  }, [rows, query]);

  const remove = async (row: AdminProductRow) => {
    if (!confirm(`למחוק את "${row.name}" מהקטלוג?`)) return;
    await fetch(`/api/admin/products/${row.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="panel">
      <input
        placeholder="חיפוש לפי שם או תת-קטגוריה…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "10px 12px",
          border: "1px solid var(--line)",
          borderRadius: 10,
          background: "var(--bg)",
          color: "var(--ink)",
          font: "inherit",
          width: "100%",
          maxWidth: 340,
          marginBottom: 14,
        }}
      />
      <div className="tw">
        <table className="atable">
          <thead>
            <tr>
              <th></th>
              <th>שם</th>
              <th>קטגוריה</th>
              <th>תת-קטגוריה</th>
              <th>מחיר</th>
              <th>מלאי</th>
              <th>מידות</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const [from, to] = gradientFor(p.gradientIndex, p.id);
              return (
                <tr key={p.id}>
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
                  <td style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{p.sizesCount} מידות</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <Link className="mini" href={`/admin/products/${p.id}/edit`}>
                      עריכה
                    </Link>{" "}
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
    </div>
  );
}
