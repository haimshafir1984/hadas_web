"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubcategoryManager({
  categoryId,
  subs,
}: {
  categoryId: string;
  subs: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");

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

  return (
    <div className="panel">
      <h3>תת-קטגוריות ({subs.length})</h3>
      <div style={{ marginBottom: 12 }}>
        {subs.length ? (
          subs.map((s) => (
            <span className="tagx" key={s.id}>
              {s.name}
              <button onClick={() => remove(s.id)} aria-label={`מחיקת ${s.name}`} type="button">
                ×
              </button>
            </span>
          ))
        ) : (
          <span style={{ color: "var(--ink-2)" }}>אין עדיין תת-קטגוריות.</span>
        )}
      </div>
      <div className="rowin" style={{ maxWidth: 480 }}>
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
