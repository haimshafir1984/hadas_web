"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        fontSize: 14.5,
        fontWeight: 500,
        color: "#D5C2E8",
        background: "none",
        border: 0,
        width: "100%",
        textAlign: "right",
      }}
    >
      יציאה
    </button>
  );
}
