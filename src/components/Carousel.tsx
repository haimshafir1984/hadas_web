"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

// Big cards in a single row; if they don't all fit, it becomes a carousel
// (touch-drag everywhere, arrows on desktop). RTL: "next" moves leftward.
export default function Carousel({ children, big }: { children: React.ReactNode[]; big?: boolean }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update).on("reInit", update).on("scroll", update);
  }, [emblaApi, update]);

  const overflow = canPrev || canNext;

  return (
    <div className="crsl-wrap">
      <div className="crsl-viewport" ref={emblaRef}>
        <div className={`crsl ${big ? "big" : ""}`} style={overflow ? undefined : { justifyContent: "center" }}>
          {children}
        </div>
      </div>
      {overflow && (
        <>
          <button className="crsl-arrow prev" onClick={() => emblaApi?.scrollPrev()} disabled={!canPrev} aria-label="הקודם" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          <button className="crsl-arrow next" onClick={() => emblaApi?.scrollNext()} disabled={!canNext} aria-label="הבא" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
        </>
      )}
    </div>
  );
}
