import Link from "next/link";
import Logo from "../Logo";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/admin", label: "סקירה", d: "M4 13h7V4H4zM13 8h7V4h-7zM13 20h7v-9h-7zM4 20h7v-5H4z" },
  { href: "/admin/products", label: "מוצרים", d: "M4 8l8-4 8 4-8 4zM4 8v8l8 4 8-4V8" },
  { href: "/admin/cats", label: "קטגוריות", d: "M4 6h16M4 12h16M4 18h10" },
  { href: "/admin/texts", label: "טקסטים", d: "M5 6h14M5 12h14M5 18h9" },
  { href: "/admin/orders", label: "הזמנות", d: "M6 4h12l1 16H5zM9 8h6" },
  { href: "/admin/settings", label: "הגדרות", d: "M12 8a4 4 0 100 8 4 4 0 000-8zM3 12h3M18 12h3M12 3v3M12 18v3" },
];

export default function AdminShell({
  active,
  title,
  actions,
  storeName,
  children,
}: {
  active: string;
  title: string;
  actions?: React.ReactNode;
  storeName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="adm">
      <nav className="adm-side">
        <div className="lg" style={{ background: "#fff", borderRadius: 10, padding: "6px 10px", width: "fit-content" }}>
          <Logo height={22} />
        </div>
        {NAV.map((item) => (
          <Link key={item.href} className={item.href === active ? "on" : ""} href={item.href}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d={item.d} />
            </svg>
            {item.label}
          </Link>
        ))}
        <div className="sep" />
        <Link href="/">← לצפייה בחנות</Link>
        <LogoutButton />
        <div className="foot">
          מחובר כ-admin
          <br />
          הנתונים נשמרים במסד הנתונים
        </div>
      </nav>
      <div className="adm-main">
        <div className="adm-top">
          <h1>{title}</h1>
          <div className="sp">{actions}</div>
        </div>
        {children}
      </div>
    </div>
  );
}
