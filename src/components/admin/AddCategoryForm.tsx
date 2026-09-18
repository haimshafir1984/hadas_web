"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");

  const add = async () => {
    if (!name.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/admin/cats/${data.id}`);
      router.refresh();
    } else {
      alert(data.error ?? "שמירה נכשלה");
    }
  };

  return (
    <div className="panel">
      <h3>הוספת קטגוריה</h3>
      <div className="rowin" style={{ maxWidth: 520 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="שם הקטגוריה — למשל: גרביונים"
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="btn-v" style={{ borderRadius: 10, padding: "10px 20px", fontSize: 14 }} onClick={add} type="button">
          הוספה
        </button>
      </div>
      <p style={{ color: "var(--ink-2)", fontSize: 13, margin: "10px 0 0" }}>
        קטגוריה חדשה מופיעה מיד בתפריט העליון ובתחתית האתר.
      </p>
    </div>
  );
}
