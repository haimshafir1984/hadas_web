"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Field = { key: string; label: string; group: string; multiline?: boolean; value: string };

export default function TextsForm({ fields }: { fields: Field[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(Object.fromEntries(fields.map((f) => [f.key, f.value])));
  const [saved, setSaved] = useState(false);

  const groups = [...new Set(fields.map((f) => f.group))];

  const save = async () => {
    const res = await fetch("/api/admin/texts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } else alert("שמירה נכשלה");
  };

  return (
    <>
      {groups.map((g) => (
        <div className="panel" key={g}>
          <h3>{g}</h3>
          <div className="form">
            {fields
              .filter((f) => f.group === g)
              .map((f) => (
                <div className={`fld ${f.multiline ? "full" : ""}`} key={f.key}>
                  <label>{f.label}</label>
                  {f.multiline ? (
                    <textarea value={values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
                  ) : (
                    <input value={values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
      <div style={{ position: "sticky", bottom: 0, padding: "14px 0", background: "var(--bg-2)" }}>
        <button className="btn-v" style={{ borderRadius: 11 }} onClick={save} type="button">
          {saved ? "נשמר ✓" : "שמירת כל הטקסטים"}
        </button>
      </div>
    </>
  );
}
