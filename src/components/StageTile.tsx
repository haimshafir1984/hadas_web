import Link from "next/link";
import LineIcon from "./LineIcon";

export default function StageTile({ name, iconUrl }: { name: string; iconUrl?: string | null }) {
  return (
    <Link className="stage-card" href="/c/circles">
      <LineIcon name={name} size={44} iconUrl={iconUrl} />
      <h4>{name}</h4>
    </Link>
  );
}
