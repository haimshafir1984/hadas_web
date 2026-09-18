"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(true);
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h1>אזור ניהול</h1>
        <p>פרפר סגול — ניהול קטלוג, קטגוריות והזמנות</p>
        {error && <div className="err">שם משתמש או סיסמה שגויים</div>}
        <div className="fld">
          <label htmlFor="lu">שם משתמש</label>
          <input id="lu" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </div>
        <div className="fld">
          <label htmlFor="lp">סיסמה</label>
          <input
            id="lp"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
        </div>
        <button className="btn-v" style={{ width: "100%", borderRadius: 11, marginTop: 6 }} onClick={submit} type="button">
          כניסה
        </button>
        <div className="hintbox">
          שם משתמש <b>admin</b>, סיסמה <b>1234</b>. האתר עדיין בבדיקות — אימות ניהול אמיתי יוחלף בהמשך (ראו README).
        </div>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <Link href="/" style={{ color: "var(--violet)", fontWeight: 600, fontSize: 14 }}>
            ← חזרה לחנות
          </Link>
        </div>
      </div>
    </div>
  );
}
