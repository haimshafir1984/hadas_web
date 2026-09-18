"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BagIcon, BurgerIcon, CloseIcon, LogoMark } from "./icons";
import { useCart } from "@/lib/cart-context";
import type { NavCategory } from "@/lib/types";

export default function SiteChrome({
  categories,
  tickerHtml,
}: {
  categories: NavCategory[];
  tickerHtml: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isOn = (href: string) => pathname === href;

  return (
    <>
      <div className="note">אתר פרפר סגול · גרסה בבדיקות</div>
      {/* eslint-disable-next-line react/no-danger */}
      <div className="ticker" dangerouslySetInnerHTML={{ __html: tickerHtml }} />

      <header className="site">
        <div className="wrap mheader">
          <Link className="mlogo" href="/">
            <LogoMark size={24} />
            פרפר סגול
          </Link>
          <div className="mtools">
            <Link className="micon" href="/cart" aria-label="סל קניות">
              <BagIcon />
              {count > 0 && <span className="bagn">{count}</span>}
            </Link>
            <button
              className="micon"
              aria-label="תפריט"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <BurgerIcon />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? "show" : ""}`} aria-hidden={!open}>
        <div className="drawer-head">
          <Link className="mlogo" href="/" onClick={() => setOpen(false)}>
            <LogoMark />
            פרפר סגול
          </Link>
          <button className="micon" aria-label="סגירה" onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <nav className="drawer-nav">
          <Link className={`dn-link ${isOn("/") ? "on" : ""}`} href="/" onClick={() => setOpen(false)}>
            דף הבית
          </Link>
          {categories.map((c) => (
            <details key={c.id} className="dn-cat">
              <summary>
                <Link
                  href={`/c/${c.id}`}
                  className={isOn(`/c/${c.id}`) ? "on" : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                >
                  {c.name}
                </Link>
              </summary>
              <div className="dn-subs">
                {c.subs.map((s) => (
                  <Link key={s.id} href={`/c/${c.id}/${s.id}`} onClick={() => setOpen(false)}>
                    {s.name}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <Link className={`dn-link ${isOn("/quiz") ? "on" : ""}`} href="/quiz" onClick={() => setOpen(false)}>
            שאלון התאמת חזייה
          </Link>
          <Link className={`dn-link ${isOn("/guides") ? "on" : ""}`} href="/guides" onClick={() => setOpen(false)}>
            מדריכים
          </Link>
          <Link className={`dn-link ${isOn("/about") ? "on" : ""}`} href="/about" onClick={() => setOpen(false)}>
            עלינו
          </Link>
          <Link className={`dn-link ${isOn("/c/sale") ? "on" : ""}`} href="/c/sale" onClick={() => setOpen(false)}>
            מבצעים
          </Link>
          <div className="dn-foot">
            <Link className="dn-link" href="/cart" onClick={() => setOpen(false)}>
              סל קניות{count ? ` (${count})` : ""}
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
