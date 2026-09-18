import Link from "next/link";
import { GRAD } from "@/lib/format";
import { CategoryGlyph } from "./icons";

export function CategoryTile({ name, href }: { name: string; href: string }) {
  const idx = (name.length + href.length) % GRAD.length;
  const [from, to] = GRAD[idx];
  return (
    <Link className="c-card" href={href}>
      <div className="cph" style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}>
        <CategoryGlyph />
      </div>
      <span className="cn">{name}</span>
    </Link>
  );
}

export function GuideTile({ title, href }: { title: string; href: string }) {
  return (
    <Link className="c-card" href={href} style={{ width: 150 }}>
      <div className="cph" style={{ borderRadius: 16, background: "linear-gradient(140deg,#3B2352,#7A4C9E)" }}>
        <CategoryGlyph />
      </div>
      <span className="cn">{title}</span>
    </Link>
  );
}
