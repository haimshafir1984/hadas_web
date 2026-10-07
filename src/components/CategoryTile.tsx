import Link from "next/link";
import LineIcon from "./LineIcon";

export function CategoryTile({ name, href, iconUrl }: { name: string; href: string; iconUrl?: string | null }) {
  return (
    <Link className="c-card" href={href}>
      <div className="cph">
        <LineIcon name={name} iconUrl={iconUrl} />
      </div>
      <span className="cn">{name}</span>
    </Link>
  );
}

export function GuideTile({ title, href }: { title: string; href: string }) {
  return (
    <Link className="c-card" href={href}>
      <div className="cph">
        <LineIcon name="מדריך" />
      </div>
      <span className="cn">{title}</span>
    </Link>
  );
}
