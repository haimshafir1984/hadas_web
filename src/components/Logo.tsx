const ASPECT = 1834 / 1630;

export default function Logo({ height = 32, className }: { height?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="פרפר סגול"
      width={Math.round(height * ASPECT)}
      height={height}
      className={className}
      style={{ display: "block", height, width: "auto" }}
    />
  );
}
