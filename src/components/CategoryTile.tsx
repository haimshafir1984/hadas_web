import Link from "next/link";
import LineIcon from "./LineIcon";

export function CategoryTile({ name, href }: { name: string; href: string }) {
  return (
    <Link className="c-card" href={href}>
      <div className="cph">
        <LineIcon name={name} />
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
