"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BagIcon, BurgerIcon, CloseIcon } from "./icons";
import Logo from "./Logo";
import { useCart } from "@/lib/cart-context";
import type { NavCategory } from "@/lib/types";

export default function SiteChrome({ categories }: { categories: NavCategory[] }) {
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

      <header className="site">
        <div className="wrap mheader">
          <Link className="mlogo" href="/">
            <Logo height={52} />
          </Link>
          <nav className="topnav" aria-label="ראשי">
            {categories.map((c) => (
              <div className="tn-item" key={c.id}>
                <Link href={`/c/${c.id}`} className={isOn(`/c/${c.id}`) ? "on" : ""}>
                  {c.name}
                </Link>
                {c.subs.length > 0 && (
                  <div className="tn-drop">
                    {c.subs.map((sub) => (
                      <Link key={sub.id} href={`/c/${c.id}/${sub.id}`}>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="tn-item">
              <Link href="/size-guide" className={isOn("/size-guide") ? "on" : ""}>מדריך מידות</Link>
            </div>
            <div className="tn-item">
              <Link href="/guides" className={isOn("/guides") ? "on" : ""}>מדריכים</Link>
            </div>
            <div className="tn-item">
              <Link href="/about" className={isOn("/about") ? "on" : ""}>עלינו</Link>
            </div>
            <div className="tn-item">
              <Link href="/c/sale" className="tn-sale">מבצעים</Link>
            </div>
          </nav>
          <div className="mtools">
            <Link className="micon" href="/cart" aria-label="סל קניות">
              <BagIcon />
              {count > 0 && <span className="bagn">{count}</span>}
            </Link>
            <button
              className="micon burger"
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
            <Logo height={40} />
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
          <Link className={`dn-link ${isOn("/size-guide") ? "on" : ""}`} href="/size-guide" onClick={() => setOpen(false)}>
            מדריך מידות
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
