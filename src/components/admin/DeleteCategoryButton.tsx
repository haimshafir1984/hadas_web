"use client";

import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  const remove = async () => {
    if (!confirm(`למחוק את הקטגוריה "${name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "מחיקה נכשלה");
      return;
    }
    router.refresh();
  };

  return (
    <button className="mini dang" onClick={remove} type="button">
      מחיקה
    </button>
  );
}
