import { gradientFor } from "@/lib/format";

type Props = {
  id: string;
  name: string;
  gradientIndex: number;
  imageUrl?: string | null;
  badge?: string | null;
  sale?: boolean;
  isNew?: boolean;
  className?: string;
};

// Renders the uploaded product photo when one exists; otherwise falls back to
// the prototype's gradient-placeholder look so the catalog never looks broken
// while the real photo library is still being filled in.
export default function ProductPh({ id, name, gradientIndex, imageUrl, badge, sale, isNew, className }: Props) {
  const [from, to] = gradientFor(gradientIndex, id);
  return (
    <div
      className={`ph ${className ?? ""}`}
      style={imageUrl ? undefined : { background: `linear-gradient(140deg, ${from}, ${to})` }}
    >
      {badge && <span className={`rib ${sale ? "sale" : ""} ${isNew ? "new" : ""}`}>{badge}</span>}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={name} />
      ) : (
        <span className="glyph">{name}</span>
      )}
    </div>
  );
}
