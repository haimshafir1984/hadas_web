"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryEditForm({
  categoryId,
  name: initialName,
  blurb: initialBlurb,
}: {
  categoryId: string;
  name: string;
  blurb: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [blurb, setBlurb] = useState(initialBlurb);

  const save = async () => {
    const res = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, blurb }),
    });
    if (res.ok) router.refresh();
    else alert("שמירה נכשלה");
  };

  return (
    <div className="panel">
      <div className="form">
        <div className="fld">
          <label>שם הקטגוריה</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="fld">
          <label>מזהה בכתובת</label>
          <input value={categoryId} disabled />
        </div>
        <div className="fld full">
          <label>תיאור שמופיע בראש עמוד הקטגוריה</label>
          <textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} />
        </div>
        <div className="full">
          <button className="btn-v" style={{ borderRadius: 11 }} onClick={save} type="button">
            שמירת שינויים
          </button>
        </div>
      </div>
    </div>
  );
}
