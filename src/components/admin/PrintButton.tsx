"use client";

export default function PrintButton() {
  return (
    <button className="mini" type="button" onClick={() => window.print()}>
      הדפסה
    </button>
  );
}
