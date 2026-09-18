"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const LABELS: Record<string, string> = { NEW: "חדשה", IN_PROGRESS: "בטיפול", SENT: "נשלחה" };

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setValue(next);
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={saving}
      style={{ padding: "5px 8px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--bg)", color: "var(--ink)", font: "inherit", fontSize: 13 }}
    >
      {Object.entries(LABELS).map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );
}
