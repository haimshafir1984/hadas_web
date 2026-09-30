"use client";

import { useRef } from "react";

const MAX_TILT_DEG = 8;

/**
 * Wraps a product photo/placeholder in a subtle "floating card" that tilts
 * gently toward the pointer with a soft shadow that shifts opposite the
 * tilt, giving a light pseudo-3D feel without any real 3D asset generation.
 * Desktop-only (pointer: fine); touch devices and prefers-reduced-motion
 * just render the flat card.
 */
export default function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt()) return;
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rotateY = (px - 0.5) * MAX_TILT_DEG * 2;
    const rotateX = (0.5 - py) * MAX_TILT_DEG * 2;

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      el.style.setProperty("--tilt-shadow-x", `${(px - 0.5) * -24}px`);
      el.style.setProperty("--tilt-shadow-y", `${(py - 0.5) * -18 + 18}px`);
    });
  };

  const onLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    el.style.transform = "";
    el.style.setProperty("--tilt-shadow-x", "0px");
    el.style.setProperty("--tilt-shadow-y", "18px");
  };

  return (
    <div className={`tilt-card ${className ?? ""}`} ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
