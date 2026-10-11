import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { BRA_SIZES, CLOTHING_SIZES, COLOR_NAMES, PALETTE, PALETTE_NAMES } from "@/lib/format";

export const COLUMNS = [
  { key: "sku", header: "מק״ט", width: 14 },
  { key: "name", header: "שם מוצר", width: 30 },
  { key: "category", header: "קטגוריה", width: 16 },
  { key: "subcategory", header: "תת-קטגוריה", width: 18 },
  { key: "extra", header: "קטגוריות נוספות", width: 20 },
  { key: "price", header: "מחיר", width: 10 },
  { key: "wasPrice", header: "מחיר לפני הנחה", width: 14 },
  { key: "stock", header: "מלאי", width: 8 },
  { key: "badge", header: "תג", width: 12 },
  { key: "description", header: "תיאור", width: 40 },
  { key: "features", header: "מאפיינים", width: 30 },
  { key: "colors", header: "צבעים", width: 20 },
  { key: "sizes", header: "מידות", width: 28 },
  { key: "outSizes", header: "מידות שאזלו", width: 18 },
  { key: "attributes", header: "תגיות סינון", width: 22 },
  { key: "active", header: "פעיל", width: 8 },
] as const;

type Key = (typeof COLUMNS)[number]["key"];

const CUPS = ["A", "B", "C", "D", "DD", "E", "F"];

function cellText(v: ExcelJS.CellValue): string {
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    if ("richText" in v) return v.richText.map((r) => r.text).join("").trim();
    if ("text" in v) return String((v as { text: unknown }).text).trim();
    if ("result" in v) return String((v as { result: unknown }).result ?? "").trim();
  }
  return String(v).trim();
}

const list = (s: string) =>
  s
    .split(/[;\n,،]+/)
    .map((x) => x.trim())
    .filter(Boolean);

export function expandSizes(text: string): { sizes: string[]; errors: string[] } {
  const out: string[] = [];
  const errors: string[] = [];
  for (const tok of list(text)) {
    if (tok === "חזיות") out.push(...BRA_SIZES);
    else if (tok === "ביגוד") out.push(...CLOTHING_SIZES);
    else {
      const m = tok.toUpperCase().match(/^(\d{2})\s*-\s*(\d{2})\s*([A-Z]{1,2})\s*-\s*([A-Z]{1,2})$/);
      if (m) {
        const [a, b] = [Number(m[1]), Number(m[2])];
        const c1 = CUPS.indexOf(m[3]);
        const c2 = CUPS.indexOf(m[4]);
        if (c1 < 0 || c2 < c1 || b < a) {
          errors.push(`טווח מידות לא תקין: ${tok}`);
          continue;
        }
        for (let band = a; band <= b; band += 5) for (let c = c1; c <= c2; c++) out.push(`${band}${CUPS[c]}`);
      } else out.push(tok);
    }
  }
  return { sizes: Array.from(new Set(out)), errors };
}

export function parseColors(text: string): { colors: string[]; errors: string[] } {
  const colors: string[] = [];
  const errors: string[] = [];
  for (const tok of list(text)) {
    const hex = tok.startsWith("#") ? tok.toUpperCase() : COLOR_NAMES[tok];
    if (hex && PALETTE.includes(hex)) colors.push(hex);
    else errors.push(`צבע לא מוכר: "${tok}" (אפשר: ${Object.values(PALETTE_NAMES).join(", ")})`);
  }
  return { colors: Array.from(new Set(colors)), errors };
}

export type ImportData = {
  sku: string;
  name: string;
  categoryId: string;
  subcategoryId: string | null;
  extraCategoryIds: string[];
  price: number;
  wasPrice: number | null;
  stock: number;
  badge: string | null;
  description: string;
  features: string[];
  colors: string[];
  sizes: string[];
  outOfStockSizes: string[];
  attributes: string[];
  isActive: boolean;
};

export type ImportRow = {
  line: number;
  sku: string;
  name: string;
  action: "create" | "update" | "error";
  errors: string[];
  warnings: string[];
  data?: ImportData;
};

function norm(s: string) {
  return s.replace(/[\s"'״׳\-_]/g, "").toLowerCase();
}

export async function parseWorkbook(buffer: Buffer): Promise<ImportRow[]> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error("הקובץ ריק");

  const colIndex = new Map<Key, number>();
  ws.getRow(1).eachCell((cell, n) => {
    const h = norm(cellText(cell.value));
    const col = COLUMNS.find((c) => norm(c.header) === h);
    if (col) colIndex.set(col.key, n);
  });
  for (const req of ["sku", "name", "category", "price"] as Key[]) {
    if (!colIndex.has(req)) throw new Error(`חסרה עמודה "${COLUMNS.find((c) => c.key === req)!.header}" בשורה הראשונה`);
  }

  const cats = await prisma.category.findMany({ include: { subcategories: true } });
  const existing = await prisma.product.findMany({ where: { sku: { not: null } }, select: { sku: true } });
  const existingSkus = new Set(existing.map((p) => p.sku));
  const seen = new Set<string>();
  const rows: ImportRow[] = [];

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const get = (k: Key) => (colIndex.has(k) ? cellText(row.getCell(colIndex.get(k)!).value) : "");
    if (!COLUMNS.some((c) => get(c.key))) continue;

    const errors: string[] = [];
    const warnings: string[] = [];
    const sku = get("sku");
    const name = get("name");
    if (!sku) errors.push("חסר מק״ט");
    else if (seen.has(sku)) errors.push(`המק״ט ${sku} מופיע פעמיים בקובץ`);
    seen.add(sku);
    if (!name) errors.push("חסר שם מוצר");

    const catName = get("category");
    const cat = cats.find((c) => norm(c.name) === norm(catName));
    if (!cat) {
      const near = catName
        ? cats.find((c) => norm(c.name).includes(norm(catName)) || norm(catName).includes(norm(c.name)))
        : undefined;
      errors.push(
        `קטגוריה לא קיימת: "${catName}"` +
          (near ? ` — אולי התכוונת ל"${near.name}"?` : ` (קיימות: ${cats.map((c) => c.name).join(", ")})`),
      );
    }

    let subcategoryId: string | null = null;
    const subName = get("subcategory");
    if (subName && cat) {
      const sub = cat.subcategories.find((s) => norm(s.name) === norm(subName));
      if (sub) subcategoryId = sub.id;
      else
        errors.push(
          `תת-קטגוריה "${subName}" לא קיימת תחת "${cat.name}" (קיימות: ${cat.subcategories.map((s) => s.name).join(", ") || "אין"})`,
        );
    }

    const extraCategoryIds: string[] = [];
    for (const n of list(get("extra"))) {
      const c = cats.find((x) => norm(x.name) === norm(n));
      if (!c) errors.push(`קטגוריה נוספת לא קיימת: "${n}"`);
      else if (c.id !== cat?.id) extraCategoryIds.push(c.id);
    }

    const price = Number(get("price").replace(/[^\d.]/g, ""));
    if (!Number.isFinite(price) || price <= 0) errors.push("מחיר חסר או לא תקין");
    const wasRaw = get("wasPrice");
    const wasPrice = wasRaw ? Number(wasRaw.replace(/[^\d.]/g, "")) : null;
    if (wasPrice != null && !(wasPrice > price)) warnings.push("מחיר לפני הנחה לא גבוה מהמחיר — יתעלם ממנו");
    const stockRaw = get("stock");
    const stock = stockRaw ? Number(stockRaw) : 0;
    if (!Number.isInteger(stock) || stock < 0) errors.push("מלאי לא תקין");

    const colorsText = get("colors");
    const colorRes = colorsText ? parseColors(colorsText) : { colors: ["#F4EFE9"], errors: [] as string[] };
    errors.push(...colorRes.errors);
    if (!colorsText) warnings.push("לא הוזנו צבעים — הוגדר שמנת");

    const sizeRes = get("sizes") ? expandSizes(get("sizes")) : { sizes: ["מידה אחת"], errors: [] as string[] };
    errors.push(...sizeRes.errors);
    const out = expandSizes(get("outSizes")).sizes;
    for (const s of out) if (!sizeRes.sizes.includes(s)) warnings.push(`מידה שאזלה "${s}" לא ברשימת המידות`);

    const isActive = !["לא", "no", "false", "0", "מוסתר"].includes(get("active").toLowerCase());

    const action: ImportRow["action"] = errors.length ? "error" : existingSkus.has(sku) ? "update" : "create";
    rows.push({
      line: r,
      sku,
      name,
      action,
      errors,
      warnings,
      data:
        action === "error"
          ? undefined
          : {
              sku,
              name,
              categoryId: cat!.id,
              subcategoryId,
              extraCategoryIds,
              price,
              wasPrice: wasPrice && wasPrice > price ? wasPrice : null,
              stock,
              badge: get("badge") || null,
              description: get("description"),
              features: list(get("features")),
              colors: colorRes.colors,
              sizes: sizeRes.sizes,
              outOfStockSizes: out.filter((s) => sizeRes.sizes.includes(s)),
              attributes: list(get("attributes")),
              isActive,
            },
    });
  }
  return rows;
}

export async function commitRows(rows: ImportRow[]) {
  let created = 0;
  let updated = 0;
  for (const r of rows) {
    if (!r.data) continue;
    const { extraCategoryIds, ...d } = r.data;
    const exists = await prisma.product.findUnique({ where: { sku: d.sku }, select: { id: true } });
    if (exists) {
      await prisma.product.update({
        where: { id: exists.id },
        data: { ...d, extraCategories: { set: extraCategoryIds.map((id) => ({ id })) } },
      });
      updated++;
    } else {
      await prisma.product.create({
        data: { ...d, extraCategories: { connect: extraCategoryIds.map((id) => ({ id })) } },
      });
      created++;
    }
  }
  return { created, updated };
}

export async function buildWorkbook(mode: "template" | "export") {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("מוצרים", { views: [{ rightToLeft: true, state: "frozen", ySplit: 1 }] });
  ws.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }));
  ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6D2E9E" } };

  const cats = await prisma.category.findMany({
    include: { subcategories: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });

  if (mode === "export") {
    const products = await prisma.product.findMany({
      include: { category: true, subcategory: true, extraCategories: true },
      orderBy: { createdAt: "asc" },
    });
    for (const p of products) {
      ws.addRow({
        sku: p.sku ?? "",
        name: p.name,
        category: p.category.name,
        subcategory: p.subcategory?.name ?? "",
        extra: p.extraCategories.map((c) => c.name).join("; "),
        price: p.price,
        wasPrice: p.wasPrice ?? "",
        stock: p.stock,
        badge: p.badge ?? "",
        description: p.description ?? "",
        features: p.features.join("; "),
        colors: p.colors.map((c) => PALETTE_NAMES[c] ?? c).join("; "),
        sizes: p.sizes.join("; "),
        outSizes: p.outOfStockSizes.join("; "),
        attributes: p.attributes.join("; "),
        active: p.isActive ? "כן" : "לא",
      });
    }
  } else {
    const c = cats[0];
    ws.addRow({
      sku: "BR-1001",
      name: "חזייה לדוגמה (למחוק שורה זו)",
      category: c?.name ?? "חזיות",
      subcategory: c?.subcategories[0]?.name ?? "",
      price: 189,
      wasPrice: 229,
      stock: 12,
      badge: "חדש",
      description: "תיאור קצר של המוצר",
      features: "בד נושם; ללא תפרים",
      colors: "שמנת; שחור",
      sizes: "70-90 B-D",
      outSizes: "70D",
      attributes: "ללא חישוק; ריפוד עדין",
      active: "כן",
    });
  }

  const help = wb.addWorksheet("הוראות", { views: [{ rightToLeft: true }] });
  help.columns = [{ width: 110 }];
  [
    'איך ממלאים: שורה אחת לכל מוצר בגיליון "מוצרים". מק״ט הוא חובה וייחודי — מק״ט שכבר קיים באתר יעדכן את המוצר, מק״ט חדש ייצור מוצר.',
    'קטגוריה ותת-קטגוריה: לפי השמות בגיליון "קטגוריות" (חייבות להיות קיימות באתר מראש).',
    "ריבוי ערכים (קטגוריות נוספות, מאפיינים, צבעים, מידות, תגיות) — מפרידים ב-; או בפסיק.",
    'מידות: אפשר לכתוב רשימה (S; M; L), את המילה "חזיות" / "ביגוד" לכל המידות, או טווח כמו 70-90 B-D (כל הרצועות בקפיצות של 5 וכל הכוסות).',
    "צבעים: " + Object.values(PALETTE_NAMES).join(", "),
    'פעיל: "כן" או "לא" (לא = מוסתר מהחנות). ריק = כן.',
    'תמונות לא נכנסות בקובץ — מעלים אותן אחר כך בדף "העלאת תמונות", כששם הקובץ = המק״ט (BR-1001.jpg, BR-1001_2.jpg).',
  ].forEach((t) => help.addRow([t]));

  const cs = wb.addWorksheet("קטגוריות", { views: [{ rightToLeft: true }] });
  cs.columns = [
    { header: "קטגוריה", width: 20 },
    { header: "תת-קטגוריות", width: 80 },
  ];
  cs.getRow(1).font = { bold: true };
  for (const c of cats) cs.addRow([c.name, c.subcategories.map((s) => s.name).join("; ")]);

  return wb.xlsx.writeBuffer();
}
