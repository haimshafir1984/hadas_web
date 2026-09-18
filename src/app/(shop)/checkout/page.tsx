"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useCartSummary } from "@/lib/useCartSummary";
import { nis } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { summary } = useCartSummary();
  const router = useRouter();
  const { show } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const placeOrder = async () => {
    if (!items.length) {
      show("הסל ריק");
      return;
    }
    if (!form.name.trim() || !form.phone.trim()) {
      show("נא למלא שם וטלפון");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();
      if (!res.ok) {
        show(data.error ?? "משהו לא הצליח");
        return;
      }
      clear();
      router.push(`/done?order=${data.orderNumber}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrap" style={{ maxWidth: 820, paddingBottom: 60 }}>
      <div className="crumb">
        <Link href="/cart">סל</Link> ← <b>פרטים</b> ← אישור
      </div>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>פרטים אישיים וכתובת</h1>
      <p style={{ color: "var(--ink-2)", marginTop: 0 }}>ההזמנה מגיעה למייל של פרפר סגול. נחזור אלייך לאישור לפני החיוב.</p>
      <div className="checkout-fields">
        <label style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--ink-2)" }}>
          שם מלא
          <input style={inputStyle} value={form.name} onChange={set("name")} />
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--ink-2)" }}>
          טלפון
          <input style={inputStyle} value={form.phone} onChange={set("phone")} />
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--ink-2)" }}>
          דוא״ל
          <input style={inputStyle} value={form.email} onChange={set("email")} />
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--ink-2)" }}>
          עיר
          <input style={inputStyle} value={form.city} onChange={set("city")} />
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--ink-2)" }}>
          רחוב ומספר
          <input style={inputStyle} value={form.address} onChange={set("address")} />
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 13, color: "var(--ink-2)" }}>
          הערות לשליח
          <input style={inputStyle} value={form.notes} onChange={set("notes")} />
        </label>
      </div>
      {summary && (
        <div className="sumbox" style={{ position: "static", marginTop: 20 }}>
          <div className="sline">
            <span>מוצרים</span>
            <span className="mono">{nis(summary.subtotal)}</span>
          </div>
          <div className="sline">
            <span>משלוח</span>
            <span className="mono">{summary.shipping ? nis(summary.shipping) : "חינם"}</span>
          </div>
          <div className="stot">
            <span>לתשלום</span>
            <span className="mono">{nis(summary.total)}</span>
          </div>
          <button
            className="btn-v"
            style={{ display: "block", width: "100%", textAlign: "center", marginTop: 14, borderRadius: 12 }}
            onClick={placeOrder}
            disabled={submitting}
            type="button"
          >
            שליחת ההזמנה
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 12,
  border: "1px solid var(--line)",
  borderRadius: 10,
  background: "var(--card)",
  color: "var(--ink)",
  font: "inherit",
};
