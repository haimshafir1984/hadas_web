import Link from "next/link";
import { GRAD } from "@/lib/format";
import { StageGlyph } from "./icons";

export default function StageTile({ name, blurb, index }: { name: string; blurb: string; index: number }) {
  const [from, to] = GRAD[index % GRAD.length];
  return (
    <Link className="stage-card" href={`/c/circles`}>
      <div className="sph" style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}>
        <StageGlyph />
      </div>
      <h4>{name}</h4>
      <span>{blurb}</span>
    </Link>
  );
}
