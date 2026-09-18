"use client";

import { useRouter } from "next/navigation";

export default function ResetDemoDataButton() {
  const router = useRouter();

  const reset = async () => {
    if (!confirm("לאפס את כל נתוני ההדגמה?")) return;
    await fetch("/api/admin/reset", { method: "POST" });
    router.refresh();
  };

  return (
    <button className="mini dang" onClick={reset} type="button">
      איפוס הכול
    </button>
  );
}
