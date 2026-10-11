"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Moves an item up/down in its list. `url` receives PATCH {move: "up" | "down"}.
export default function MoveButtons({ url }: { url: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const go = async (move: "up" | "down") => {
    setBusy(true);
    await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ move }) });
    setBusy(false);
    router.refresh();
  };

  return (
    <span style={{ whiteSpace: "nowrap" }}>
      <button className="mini" disabled={busy} onClick={() => go("up")} type="button" aria-label="הזזה למעלה">
        ▲
      </button>{" "}
      <button className="mini" disabled={busy} onClick={() => go("down")} type="button" aria-label="הזזה למטה">
        ▼
      </button>
    </span>
  );
}
