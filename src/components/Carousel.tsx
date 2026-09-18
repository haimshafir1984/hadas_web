type Props = {
  children: React.ReactNode[];
  big?: boolean;
};

export default function Carousel({ children, big }: Props) {
  return (
    <div className="crsl-wrap">
      <div className={`crsl-scroll md:hidden ${big ? "big" : ""}`}>{children}</div>
      <div className={`crsl-desktop-grid hidden md:grid ${big ? "big" : ""}`}>{children}</div>
    </div>
  );
}
