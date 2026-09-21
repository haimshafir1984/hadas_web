import Link from "next/link";
import LineIcon from "./LineIcon";

export default function StageTile({ name }: { name: string }) {
  return (
    <Link className="stage-card" href="/c/circles">
      <LineIcon name={name} size={44} />
      <h4>{name}</h4>
    </Link>
  );
}
