"use client";

import Link from "next/link";
import { useState } from "react";
import { WhatsAppIcon } from "./icons";
import type { NavCategory } from "@/lib/types";

export default function SiteFooter({
  categories,
  storeName,
  address,
  phone,
}: {
  categories: NavCategory[];
  storeName: string;
  address: string;
  phone: string;
}) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      <footer className="site">
        <div className="wrap" style={{ paddingTop: 34 }}>
          <div className="news">
            <div>
              <h3>10% הנחה על ההזמנה הראשונה</h3>
              <p>מדריכי מידות, מבצעים ודגמים חדשים — פעם בשבועיים, בלי ספאם.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
            >
              <input type="email" placeholder="המייל שלך" aria-label="כתובת מייל" required />
              <button className="btn" type="submit">
                {subscribed ? "נרשמת ✓" : "הרשמה"}
              </button>
            </form>
          </div>
          <div className="fg">
            <div>
              <div style={{ marginBottom: 10, fontWeight: 800 }}>{storeName}</div>
              <p style={{ fontSize: 14, color: "var(--ink-2)", maxWidth: "34ch", margin: 0 }}>
                הלבשה תחתונה עם התאמה אישית מאז 2009. {address} · {phone}
              </p>
            </div>
            <div>
              <h5>קטגוריות</h5>
              <ul>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link href={`/c/${c.id}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5>מידע</h5>
              <ul>
                <li><Link href="/about">האני מאמין שלנו</Link></li>
                <li><Link href="/about">מחיי החנות</Link></li>
                <li><Link href="/about">אני מסמיקה :)</Link></li>
                <li><Link href="/guides">מדריכים</Link></li>
                <li><Link href="/about">איך מגיעים</Link></li>
              </ul>
            </div>
            <div>
              <h5>שירות</h5>
              <ul>
                <li><Link href="/about">משלוחים והחזרות</Link></li>
                <li><Link href="/quiz">שאלון התאמת חזייה</Link></li>
                <li><Link href="/about">הצהרת נגישות</Link></li>
                <li><Link href="/about">תנאי שימוש</Link></li>
                <li><Link href="/about">מדיניות פרטיות</Link></li>
              </ul>
            </div>
          </div>
          <div className="fbot">
            <span>© 2026 {storeName}</span>
            <span>
              תשלום מאובטח · אשראי / ביט / פייפאל · <Link href="/admin">כניסת מנהל</Link>
            </span>
          </div>
        </div>
      </footer>
      <a className="wa" href="/about" aria-label="וואטסאפ">
        <WhatsAppIcon />
      </a>
    </>
  );
}
