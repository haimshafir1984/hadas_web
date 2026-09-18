"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type Props = {
  children: React.ReactNode[];
  big?: boolean;
};

/**
 * Horizontal product/category carousel.
 * Mobile keeps the prototype's plain touch-scroll-with-snap feel (no arrows).
 * Desktop (md+) gets prev/next arrows, click-to-advance, and arrow-key
 * navigation instead of raw mouse-drag scrolling — RTL-aware via embla's
 * `direction: "rtl"` option, so "next" always advances visually leftward.
 */
export default function Carousel({ children, big }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const showArrows = canPrev || canNext;

  return (
    <div
      className="crsl-wrap"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") scrollNext();
        if (e.key === "ArrowRight") scrollPrev();
      }}
    >
      {/* Mobile: native horizontal scroll with snap, matching the prototype. */}
      <div className={`crsl-scroll md:hidden ${big ? "big" : ""}`}>{children}</div>

      {/* Desktop: embla-driven viewport with arrow navigation. */}
      <div className="hidden md:block">
        <div className="crsl-viewport" ref={emblaRef} tabIndex={0}>
          <div className={`crsl ${big ? "big" : ""}`}>{children}</div>
        </div>
        {showArrows && (
          <>
            <button
              className="crsl-arrow prev"
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="הקודם"
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <button
              className="crsl-arrow next"
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="הבא"
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
