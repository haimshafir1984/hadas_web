"use client";

import Link from "next/link";
import { WhatsAppIcon } from "./icons";
import type { NavCategory } from "@/lib/types";

export default function SiteFooter({
  categories,
  storeName,
  address,
  phone,
  aboutText,
}: {
  categories: NavCategory[];
  storeName: string;
  address: string;
  phone: string;
  aboutText: string;
}) {
  return (
    <>
      <footer className="site">
        <div className="wrap" style={{ paddingTop: 34 }}>
          <div className="fg">
            <div>
              <div style={{ marginBottom: 10, fontWeight: 800 }}>{storeName}</div>
              <p style={{ fontSize: 14, color: "var(--ink-2)", maxWidth: "34ch", margin: 0 }}>
                {aboutText} {address} · {phone}
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
                <li><Link href="/size-guide">מדריך מידות</Link></li>
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
