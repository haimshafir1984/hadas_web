"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GRAD, PALETTE, SIZE_KITS } from "@/lib/format";
import type { NavCategory } from "@/lib/types";

const BRA_BANDS = ["65", "70", "75", "80", "85", "90", "95", "100", "105", "110"];
const BRA_CUPS = ["A", "B", "C", "D", "DD"];

function braParts(sizes: string[]) {
  const bands = new Set<string>();
  const cups = new Set<string>();
  sizes.forEach((size) => {
    const match = size.replace(/\s+/g, "").match(/^(\d+)([A-Za-z]+)$/);
    if (!match) return;
    bands.add(match[1]);
    cups.add(match[2].toUpperCase());
  });
  return { bands, cups };
}

export type ProductFormValue = {
  id?: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  badge: string;
  price: number;
  wasPrice: number | null;
  stock: number;
  description: string;
  features: string[];
  colors: string[];
  sizes: string[];
  outOfStockSizes: string[];
  gradientIndex: number;
  imageUrls: string[];
  extraCategoryIds: string[];
};

export default function ProductForm({
  categories,
  initial,
}: {
  categories: NavCategory[];
  initial: ProductFormValue;
}) {
  const router = useRouter();
  const isNew = !initial.id;
  const [value, setValue] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const activeCategory = useMemo(() => categories.find((c) => c.id === value.categoryId), [categories, value.categoryId]);
  const isBra = value.categoryId === "bras";
  const selectedBraParts = useMemo(() => braParts(value.sizes), [value.sizes]);

  const set = <K extends keyof ProductFormValue>(key: K, v: ProductFormValue[K]) =>
    setValue((cur) => ({ ...cur, [key]: v }));

  const toggleColor = (c: string) =>
    setValue((cur) => ({
      ...cur,
      colors: cur.colors.includes(c) ? cur.colors.filter((x) => x !== c) : [...cur.colors, c],
    }));

  const toggleBraPart = (part: "band" | "cup", option: string) => {
    setValue((cur) => {
      const { bands, cups } = braParts(cur.sizes);
      const selected = part === "band" ? bands : cups;
      if (selected.has(option)) selected.delete(option);
      else selected.add(option);

      const sizes = BRA_BANDS.filter((band) => bands.has(band)).flatMap((band) =>
        BRA_CUPS.filter((cup) => cups.has(cup)).map((cup) => `${band}${cup}`),
      );

      return {
        ...cur,
        sizes,
        outOfStockSizes: cur.outOfStockSizes.filter((size) => sizes.includes(size)),
      };
    });
  };

  const onFilesChosen = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("file", f));
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.urls) {
        setValue((cur) => ({ ...cur, imageUrls: [...cur.imageUrls, ...data.urls] }));
      } else {
        const message = data.error ?? "העלאת התמונה נכשלה";
        setUploadError(message);
        alert(message);
      }
    } catch {
      const message = "לא ניתן להתחבר לשירות התמונות. נסי שוב.";
      setUploadError(message);
      alert(message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const removeImage = (url: string) => setValue((cur) => ({ ...cur, imageUrls: cur.imageUrls.filter((u) => u !== url) }));

  const save = async () => {
    if (!value.name.trim()) {
      alert("נא להזין שם מוצר");
      return;
    }
    const payload = {
      ...value,
      badge: value.badge || null,
      wasPrice: value.wasPrice || null,
    };
    const res = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${value.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "שמירה נכשלה");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  };

  const remove = async () => {
    if (!value.id || !confirm(`למחוק את "${value.name}" מהקטלוג?`)) return;
    await fetch(`/api/admin/products/${value.id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div className="panel">
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="fld">
          <label>שם המוצר</label>
          <input value={value.name} onChange={(e) => set("name", e.target.value)} placeholder="למשל: חזיית תמר" />
        </div>
        <div className="fld">
          <label>קטגוריה</label>
          <select
            value={value.categoryId}
            onChange={(e) => setValue((cur) => ({ ...cur, categoryId: e.target.value, subcategoryId: "" }))}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="fld full">
          <label>
            מופיע גם בקטגוריות <span className="hint">(מעבר לקטגוריה הראשית)</span>
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories
              .filter((c) => c.id !== value.categoryId)
              .map((c) => {
                const on = value.extraCategoryIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`fchip ${on ? "on" : ""}`}
                    onClick={() =>
                      setValue((cur) => ({
                        ...cur,
                        extraCategoryIds: on ? cur.extraCategoryIds.filter((x) => x !== c.id) : [...cur.extraCategoryIds, c.id],
                      }))
                    }
                  >
                    {c.name}
                  </button>
                );
              })}
          </div>
        </div>
        <div className="fld">
          <label>תת-קטגוריה</label>
          <select value={value.subcategoryId} onChange={(e) => set("subcategoryId", e.target.value)}>
            <option value="">— ללא —</option>
            {(activeCategory?.subs ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="fld">
          <label>
            תג על התמונה <span className="hint">(ריק = בלי תג)</span>
          </label>
          <input value={value.badge} onChange={(e) => set("badge", e.target.value)} placeholder="רב-מכר / מבצע / חדש" />
        </div>
        <div className="fld">
          <label>מחיר (₪)</label>
          <input type="number" min={0} value={value.price} onChange={(e) => set("price", Number(e.target.value))} />
        </div>
        <div className="fld">
          <label>
            מחיר לפני הנחה <span className="hint">(ריק = בלי מבצע)</span>
          </label>
          <input
            type="number"
            min={0}
            value={value.wasPrice ?? ""}
            onChange={(e) => set("wasPrice", e.target.value ? Number(e.target.value) : null)}
          />
        </div>
        <div className="fld">
          <label>מלאי (יחידות)</label>
          <input type="number" min={0} value={value.stock} onChange={(e) => set("stock", Number(e.target.value))} />
        </div>

        <div className="fld full">
          <label>תמונות מוצר</label>
          <div className="upload-drop">
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(e) => onFilesChosen(e.target.files)}
            />
            <div style={{ marginTop: 6 }}>{uploading ? "מעלה…" : "גרירה או בחירת קבצים — עד 8MB לתמונה"}</div>
          </div>
          {uploadError && <div className="err" style={{ marginTop: 8 }}>{uploadError}</div>}
          {value.imageUrls.length > 0 && (
            <div className="upload-thumbs">
              {value.imageUrls.map((url) => (
                <div className="upload-thumb" key={url}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" />
                  <button type="button" onClick={() => removeImage(url)} aria-label="הסרה">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {!value.imageUrls.length && (
            <div style={{ marginTop: 10 }}>
              <label className="hint" style={{ display: "block", marginBottom: 6 }}>
                אין עדיין תמונה — פלייסהולדר גרפי (רקע):
              </label>
              <div className="gpick">
                {GRAD.map(([from, to], i) => (
                  <button
                    key={i}
                    type="button"
                    className={value.gradientIndex === i ? "on" : ""}
                    style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
                    aria-label={`רקע ${i + 1}`}
                    onClick={() => set("gradientIndex", i)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="fld full">
          <label>תיאור קצר</label>
          <textarea value={value.description} onChange={(e) => set("description", e.target.value)} placeholder="משפט או שניים שמופיעים בעמוד המוצר" />
        </div>
        <div className="fld full">
          <label>
            מאפיינים <span className="hint">(שורה לכל מאפיין)</span>
          </label>
          <textarea
            value={value.features.join("\n")}
            onChange={(e) => set("features", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))}
          />
        </div>
        <div className="fld full">
          <label>צבעים זמינים</label>
          <div className="swpick">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                className={value.colors.includes(c) ? "on" : ""}
                style={{ background: c }}
                aria-label={`צבע ${c}`}
                onClick={() => toggleColor(c)}
              />
            ))}
          </div>
        </div>
        <div className="fld full">
          <label>מידות</label>
          {isBra ? (
            <div className="bra-size-picker">
              <div className="bra-size-help">סמני את ההיקפים ואת הקאפיות. המערכת תיצור אוטומטית את כל השילובים.</div>
              <div className="bra-size-table">
                <div className="bra-size-table-row bra-size-table-head">
                  <span>סוג מידה</span>
                  <span>בחירה</span>
                </div>
                <div className="bra-size-table-row">
                  <strong>קאפ</strong>
                  <div className="bra-size-options">
                    {BRA_CUPS.map((cup) => (
                      <label
                        key={cup}
                        className={`bra-size-option ${selectedBraParts.cups.has(cup) ? "on" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBraParts.cups.has(cup)}
                          onChange={() => toggleBraPart("cup", cup)}
                        />
                        <span>{cup}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bra-size-table-row">
                  <strong>היקף</strong>
                  <div className="bra-size-options">
                    {BRA_BANDS.map((band) => (
                      <label
                        key={band}
                        className={`bra-size-option ${selectedBraParts.bands.has(band) ? "on" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBraParts.bands.has(band)}
                          onChange={() => toggleBraPart("band", band)}
                        />
                        <span>{band}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bra-size-result">
                <span>מידות שייווצרו:</span>
                {value.sizes.length ? (
                  <div className="bra-size-result-list">
                    {value.sizes.map((size) => (
                      <span key={size}>{size}</span>
                    ))}
                  </div>
                ) : (
                  <span className="hint">בחרי לפחות היקף וקאפ אחד</span>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="rowin">
                <input
                  value={value.sizes.join(",")}
                  onChange={(e) => set("sizes", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
                />
                {Object.keys(SIZE_KITS).map((k) => (
                  <button key={k} type="button" className="mini" onClick={() => set("sizes", SIZE_KITS[k].split(","))}>
                    {k}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="fld full">
          <label>
            מידות שאזלו <span className="hint">(מופרדות בפסיק, יוצגו מחוקות)</span>
          </label>
          <input
            value={value.outOfStockSizes.join(",")}
            onChange={(e) => set("outOfStockSizes", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
          />
        </div>

        <div className="full" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
          <button className="btn-v" style={{ borderRadius: 11 }} onClick={save} type="button">
            {isNew ? "יצירת המוצר" : "שמירת שינויים"}
          </button>
          {!isNew && (
            <button className="mini dang" onClick={remove} type="button">
              מחיקת המוצר
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
