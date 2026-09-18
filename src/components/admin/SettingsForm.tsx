"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type SettingsValue = {
  storeName: string;
  phone: string;
  address: string;
  tickerHtml: string;
  shippingCost: number;
  freeShippingOver: number;
};

export default function SettingsForm({ initial }: { initial: SettingsValue }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  const set = <K extends keyof SettingsValue>(key: K, v: SettingsValue[K]) =>
    setValue((cur) => ({ ...cur, [key]: v }));

  const save = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (res.ok) router.refresh();
    else alert("שמירה נכשלה");
  };

  return (
    <div className="panel">
      <div className="form">
        <div className="fld">
          <label>שם החנות</label>
          <input value={value.storeName} onChange={(e) => set("storeName", e.target.value)} />
        </div>
        <div className="fld">
          <label>טלפון</label>
          <input value={value.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="fld full">
          <label>כתובת</label>
          <input value={value.address} onChange={(e) => set("address", e.target.value)} />
        </div>
        <div className="fld full">
          <label>
            רצועת הודעה עליונה <span className="hint">(אפשר להשתמש ב-&lt;b&gt; להדגשה)</span>
          </label>
          <textarea value={value.tickerHtml} onChange={(e) => set("tickerHtml", e.target.value)} />
        </div>
        <div className="fld">
          <label>דמי משלוח (₪)</label>
          <input type="number" min={0} value={value.shippingCost} onChange={(e) => set("shippingCost", Number(e.target.value))} />
        </div>
        <div className="fld">
          <label>משלוח חינם מעל (₪)</label>
          <input
            type="number"
            min={0}
            value={value.freeShippingOver}
            onChange={(e) => set("freeShippingOver", Number(e.target.value))}
          />
        </div>
        <div className="full">
          <button className="btn-v" style={{ borderRadius: 11 }} onClick={save} type="button">
            שמירת הגדרות
          </button>
        </div>
      </div>
    </div>
  );
}
