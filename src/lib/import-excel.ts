import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { COLOR_NAMES, PALETTE, PALETTE_NAMES } from "@/lib/format";
import { SIZE_SYSTEMS, getLists, type Lists } from "@/lib/import-lists";

// Column order matters for the generated template. The first header is the one written; the rest are accepted aliases.
const numbered = (key: string, title: string, n: number, width: number) =>
  Array.from({ length: n }, (_, i) => ({ key: `${key}${i + 1}`, headers: [`${title} ${i + 1}`], width, legacy: false, optional: false }));

// Template order. Multi-value fields get one dropdown column per value (categories up to 4, colors up to 8, attributes up to 4).
// The old single "a; b" columns are still read (legacy) so earlier files keep working.
export const COLUMNS: { key: string; headers: string[]; width: number; legacy?: boolean; optional?: boolean }[] = [
  { key: "name", headers: ["שם המוצר", "שם מוצר"], width: 28 },
  { key: "sku", headers: ["מספר דגם", "מק״ט", "מקט"], width: 14 },
  ...numbered("category", "קטגוריה", 4, 14),
  { key: "category", headers: ["שיוך לקטגוריה", "קטגוריות"], width: 26, legacy: true },
  { key: "brand", headers: ["מותג"], width: 16 },
  { key: "price", headers: ["מחיר ב-₪", "מחיר"], width: 11 },
  { key: "description", headers: ["תיאור"], width: 40 },
  ...numbered("color", "צבע", 8, 11),
  { key: "colors", headers: ["צבעים"], width: 20, legacy: true },
  { key: "sizeSystem", headers: ["סוג המידות", "סוג מידות"], width: 14 },
  { key: "fabrics", headers: ["הרכב בד"], width: 20 },
  ...numbered("attr", "מאפיין", 4, 14),
  { key: "attributes", headers: ["מאפיינים", "תגיות סינון"], width: 24, legacy: true },
  { key: "sizes", headers: ["מידות זמינות", "מידות"], width: 30 },
  // optional extras
  { key: "wasPrice", headers: ["מחיר לפני הנחה"], width: 14, optional: true },
  { key: "stock", headers: ["מלאי"], width: 8, optional: true },
  { key: "badge", headers: ["תג"], width: 12, optional: true },
  { key: "subcategory", headers: ["תת-קטגוריה"], width: 18, optional: true },
  { key: "outSizes", headers: ["מידות שאזלו"], width: 16, optional: true },
  { key: "active", headers: ["פעיל"], width: 8, optional: true },
];
const TEMPLATE_COLS = COLUMNS.filter((c) => !c.legacy);

type Key = string;

const CUPS = ["A", "B", "C", "D", "DD", "E", "F"];
const DEFAULT_STOCK = 10;

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

function norm(s: string) {
  return s.replace(/[\s"'״׳\-_]/g, "").toLowerCase();
}

export function expandSizes(text: string, all: string[], step: number): { sizes: string[]; errors: string[] } {
  const out: string[] = [];
  const errors: string[] = [];
  for (const tok of list(text)) {
    if (tok === "הכול" || tok === "הכל") out.push(...all);
    else {
      const m = tok.toUpperCase().match(/^(\d{2})\s*-\s*(\d{2})\s*([A-Z]{1,2})\s*-\s*([A-Z]{1,2})$/);
      if (m && step > 0) {
        const [a, b] = [Number(m[1]), Number(m[2])];
        const c1 = CUPS.indexOf(m[3]);
        const c2 = CUPS.indexOf(m[4]);
        if (c1 < 0 || c2 < c1 || b < a) {
          errors.push(`טווח מידות לא תקין: ${tok}`);
          continue;
        }
        for (let band = a; band <= b; band += step) for (let c = c1; c <= c2; c++) out.push(`${band}${CUPS[c]}`);
      } else out.push(tok.toUpperCase() === tok ? tok : tok.trim());
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
  stock?: number;
  badge: string | null;
  brand: string | null;
  description: string;
  colors: string[];
  sizeSystem: string | null;
  sizes: string[];
  outOfStockSizes: string[];
  fabrics: string[];
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

// Every value must come from the owner's list (only enforced once the list has entries).
function checkList(values: string[], allowed: string[], label: string, errors: string[]) {
  if (!allowed.length) return values;
  const map = new Map(allowed.map((a) => [norm(a), a]));
  const out: string[] = [];
  for (const v of values) {
    const hit = map.get(norm(v));
    if (hit) out.push(hit);
    else errors.push(`${label} "${v}" לא ברשימה — להוסיף ב"רשימות לאקסל" או לתקן`);
  }
  return out;
}

export async function parseWorkbook(buffer: Buffer): Promise<ImportRow[]> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = wb.worksheets[0];
  if (!ws) throw new Error("הקובץ ריק");

  const colIndex = new Map<Key, number>();
  ws.getRow(1).eachCell((cell, n) => {
    const h = norm(cellText(cell.value));
    const col = COLUMNS.find((c) => c.headers.some((x) => norm(x) === h));
    if (col && !colIndex.has(col.key)) colIndex.set(col.key, n);
  });
  for (const req of ["sku", "name", "price"]) {
    if (!colIndex.has(req)) throw new Error(`חסרה עמודה "${COLUMNS.find((c) => c.key === req)!.headers[0]}" בשורה הראשונה`);
  }
  if (!colIndex.has("category") && !colIndex.has("category1")) throw new Error('חסרה עמודה "קטגוריה 1" בשורה הראשונה');

  const lists: Lists = await getLists();
  const cats = await prisma.category.findMany({ include: { subcategories: true } });
  const existing = await prisma.product.findMany({ where: { sku: { not: null } }, select: { sku: true } });
  const existingSkus = new Set(existing.map((p) => p.sku));
  const seen = new Set<string>();
  const rows: ImportRow[] = [];

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const get = (k: Key) => (colIndex.has(k) ? cellText(row.getCell(colIndex.get(k)!).value) : "");
    if (!COLUMNS.some((c) => get(c.key))) continue;
    // join a legacy "a; b" column with its numbered columns
    const multi = (legacy: string, prefix: string) =>
      [get(legacy), ...COLUMNS.filter((c) => c.key.startsWith(prefix) && /\d$/.test(c.key)).map((c) => get(c.key))].filter(Boolean).join(";");

    const errors: string[] = [];
    const warnings: string[] = [];
    const sku = get("sku");
    const name = get("name");
    if (!sku) errors.push("חסר מספר דגם");
    else if (seen.has(sku)) errors.push(`מספר הדגם ${sku} מופיע פעמיים בקובץ`);
    seen.add(sku);
    if (!name) errors.push("חסר שם מוצר");

    // Category cell: each value is a category or a subcategory (of any category). First category decides the main one.
    let mainCat: (typeof cats)[number] | undefined;
    let subcategoryId: string | null = null;
    const extraIds = new Set<string>();
    for (const tok of list(multi("category", "category"))) {
      const asCat = cats.find((c) => norm(c.name) === norm(tok));
      if (asCat) {
        if (!mainCat) mainCat = asCat;
        else if (asCat.id !== mainCat.id) extraIds.add(asCat.id);
        continue;
      }
      const owner = cats.find((c) => c.subcategories.some((s) => norm(s.name) === norm(tok)));
      if (owner) {
        const sub = owner.subcategories.find((s) => norm(s.name) === norm(tok))!;
        if (!mainCat) mainCat = owner;
        else if (owner.id !== mainCat.id) extraIds.add(owner.id);
        if (owner.id === mainCat.id) {
          if (!subcategoryId) subcategoryId = sub.id;
          else warnings.push(`"${tok}" לא נשמרה כתת-קטגוריה (למוצר יש תת-קטגוריה אחת)`);
        }
        continue;
      }
      const near = cats.find((c) => norm(c.name).includes(norm(tok)) || norm(tok).includes(norm(c.name)));
      errors.push(`קטגוריה לא קיימת: "${tok}"` + (near ? ` — אולי התכוונת ל"${near.name}"?` : ""));
    }
    if (!mainCat && !errors.some((e) => e.startsWith("קטגוריה"))) errors.push("חסרה קטגוריה");
    const subName = get("subcategory");
    if (subName && mainCat) {
      const sub = mainCat.subcategories.find((s) => norm(s.name) === norm(subName));
      if (sub) subcategoryId = sub.id;
      else errors.push(`תת-קטגוריה "${subName}" לא קיימת תחת "${mainCat.name}"`);
    }

    const price = Number(get("price").replace(/[^\d.]/g, ""));
    if (!Number.isFinite(price) || price <= 0) errors.push("מחיר חסר או לא תקין");
    const wasRaw = get("wasPrice");
    const wasPrice = wasRaw ? Number(wasRaw.replace(/[^\d.]/g, "")) : null;
    if (wasPrice != null && !(wasPrice > price)) warnings.push("מחיר לפני הנחה לא גבוה מהמחיר — יתעלם ממנו");

    const isNew = !existingSkus.has(sku);
    const stockRaw = get("stock");
    let stock: number | undefined;
    if (stockRaw) {
      stock = Number(stockRaw);
      if (!Number.isInteger(stock) || stock < 0) errors.push("מלאי לא תקין");
    } else if (isNew) {
      stock = DEFAULT_STOCK;
      warnings.push(`לא הוזן מלאי — הוגדר ${DEFAULT_STOCK}`);
    }

    const colorsText = multi("colors", "color");
    const colorRes = colorsText ? parseColors(colorsText) : { colors: ["#F4EFE9"], errors: [] as string[] };
    errors.push(...colorRes.errors);
    if (!colorsText) warnings.push("לא הוזנו צבעים — הוגדר שמנת");

    const brandRaw = get("brand");
    const brand = brandRaw ? checkList([brandRaw], lists.brands, "מותג", errors)[0] ?? null : null;
    const fabrics = checkList(list(get("fabrics")), lists.fabrics, "הרכב בד", errors);
    const attributes = checkList(list(multi("attributes", "attr")), lists.attributes, "מאפיין", errors);

    // Size system decides which list the sizes must come from.
    const sysRaw = get("sizeSystem");
    let system = sysRaw ? SIZE_SYSTEMS.find((s) => norm(s.name) === norm(sysRaw) || norm(s.name).startsWith(norm(sysRaw))) : undefined;
    if (sysRaw && !system) errors.push(`סוג מידות לא מוכר: "${sysRaw}" (אפשר: ${SIZE_SYSTEMS.map((s) => s.name).join(", ")})`);
    const sizesText = get("sizes");
    let sizes = ["מידה אחת"];
    if (sizesText) {
      const probe = system ?? SIZE_SYSTEMS[0];
      const res = expandSizes(sizesText, lists[probe.key], probe.step);
      errors.push(...res.errors);
      sizes = res.sizes;
      if (!system) {
        system = SIZE_SYSTEMS.find((s) => sizes.every((x) => lists[s.key].includes(x)));
        if (!system) warnings.push("לא נבחר סוג מידות והמידות לא תואמות לאף רשימה");
      } else {
        const bad = sizes.filter((x) => !lists[system!.key].includes(x));
        if (bad.length) errors.push(`מידות שלא ברשימת ה${system.name}: ${bad.join(", ")}`);
      }
    }
    const out = expandSizes(get("outSizes"), sizes, 0).sizes;
    for (const s of out) if (!sizes.includes(s)) warnings.push(`מידה שאזלה "${s}" לא ברשימת המידות`);

    const isActive = !["לא", "no", "false", "0", "מוסתר"].includes(get("active").toLowerCase());

    const action: ImportRow["action"] = errors.length ? "error" : isNew ? "create" : "update";
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
              categoryId: mainCat!.id,
              subcategoryId,
              extraCategoryIds: Array.from(extraIds),
              price,
              wasPrice: wasPrice && wasPrice > price ? wasPrice : null,
              stock,
              badge: get("badge") || null,
              brand,
              description: get("description"),
              colors: colorRes.colors,
              sizeSystem: system?.name ?? null,
              sizes,
              outOfStockSizes: out.filter((s) => sizes.includes(s)),
              fabrics,
              attributes,
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

// values -> {key1: v1, key2: v2, ...}; anything beyond `n` is joined into the last cell with "; "
const spread = (key: string, values: string[], n: number) =>
  Object.fromEntries(
    Array.from({ length: n }, (_, i) => [`${key}${i + 1}`, i === n - 1 ? values.slice(i).join("; ") : values[i] ?? ""]),
  );

const colLetter = (n: number) => {
  let s = "";
  for (let x = n; x > 0; x = Math.floor((x - 1) / 26)) s = String.fromCharCode(65 + ((x - 1) % 26)) + s;
  return s;
};

export async function buildWorkbook(mode: "template" | "export") {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("מוצרים", { views: [{ rightToLeft: true, state: "frozen", ySplit: 1 }] });
  ws.columns = TEMPLATE_COLS.map((c) => ({ header: c.headers[0], key: c.key, width: c.width }));
  ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6D2E9E" } };
  // light hint colour on the optional columns
  TEMPLATE_COLS.forEach((c, i) => {
    if (c.optional) ws.getRow(1).getCell(i + 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF9A8AB0" } };
  });

  const lists = await getLists();
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
        name: p.name,
        sku: p.sku ?? "",
        ...spread("category", [p.category.name, ...p.extraCategories.map((c) => c.name)], 4),
        brand: p.brand ?? "",
        price: p.price,
        description: p.description ?? "",
        ...spread("color", p.colors.map((c) => PALETTE_NAMES[c] ?? c), 8),
        sizeSystem: p.sizeSystem ?? "",
        fabrics: p.fabrics.join("; "),
        ...spread("attr", p.attributes, 4),
        sizes: p.sizes.join("; "),
        wasPrice: p.wasPrice ?? "",
        stock: p.stock,
        badge: p.badge ?? "",
        subcategory: p.subcategory?.name ?? "",
        outSizes: p.outOfStockSizes.join("; "),
        active: p.isActive ? "כן" : "לא",
      });
    }
  } else {
    ws.addRow({
      name: "חזיית דוגמה (למחוק שורה זו)",
      sku: "BR-1001",
      ...spread("category", [cats[0]?.name ?? "חזיות", cats[0]?.subcategories[0]?.name ?? ""].filter(Boolean), 4),
      brand: lists.brands[0] ?? "",
      price: 189,
      description: "תיאור קצר של המוצר",
      ...spread("color", ["שמנת", "שחור"], 8),
      sizeSystem: "אירופאיות",
      fabrics: lists.fabrics.slice(0, 2).join("; "),
      ...spread("attr", lists.attributes.slice(0, 2), 4),
      sizes: "70-90 B-D",
    });
  }

  // "רשימות" sheet: one column per list, used by the dropdowns on the products sheet.
  const ls = wb.addWorksheet("רשימות", { views: [{ rightToLeft: true }] });
  const colorNames = Object.values(PALETTE_NAMES);
  const listCols: { title: string; values: string[] }[] = [
    { title: "קטגוריות", values: cats.flatMap((c) => [c.name, ...c.subcategories.map((s) => s.name)]) },
    { title: "צבעים", values: colorNames },
    { title: "מותגים", values: lists.brands },
    { title: "הרכב בד", values: lists.fabrics },
    { title: "מאפיינים", values: lists.attributes },
    { title: "מידות אירופאיות", values: lists.sizesEU },
    { title: "מידות אמריקאיות", values: lists.sizesUS },
    { title: "מידות SML", values: lists.sizesSML },
    { title: "סוגי מידות", values: SIZE_SYSTEMS.map((s) => s.name) },
  ];
  listCols.forEach((c, i) => {
    ls.getCell(1, i + 1).value = c.title;
    ls.getCell(1, i + 1).font = { bold: true };
    ls.getColumn(i + 1).width = 18;
    c.values.forEach((v, j) => (ls.getCell(j + 2, i + 1).value = v));
  });
  // lookup table: system name -> named range used by the dependent size dropdown
  const lookupCol = listCols.length + 2;
  ls.getCell(1, lookupCol).value = "סוג";
  ls.getCell(1, lookupCol + 1).value = "טווח";
  const rangeNames = ["sizes_eu", "sizes_us", "sizes_sml"];
  SIZE_SYSTEMS.forEach((s, i) => {
    ls.getCell(i + 2, lookupCol).value = s.name;
    ls.getCell(i + 2, lookupCol + 1).value = rangeNames[i];
    const colN = 6 + i;
    const len = Math.max(1, listCols[colN - 1].values.length);
    wb.definedNames.add(`'רשימות'!$${colLetter(colN)}$2:$${colLetter(colN)}$${len + 1}`, rangeNames[i]);
  });

  const rangeOf = (title: string) => {
    const i = listCols.findIndex((c) => c.title === title);
    const len = Math.max(1, listCols[i].values.length);
    return `'רשימות'!$${colLetter(i + 1)}$2:$${colLetter(i + 1)}$${len + 1}`;
  };
  const keyCol = (k: Key) => colLetter(TEMPLATE_COLS.findIndex((c) => c.key === k) + 1);
  const dv = (k: Key, formula: string, strict: boolean) => {
    const n = TEMPLATE_COLS.findIndex((c) => c.key === k) + 1;
    for (let r = 2; r <= 1000; r++) {
      ws.getCell(r, n).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [formula],
        showErrorMessage: strict,
        errorStyle: "warning",
        error: "הערך לא ברשימה",
      };
    }
  };
  // multi-value columns accept free text ("a; b"), so their dropdown is only a hint (no error)
  for (let i = 1; i <= 4; i++) dv(`category${i}`, rangeOf("קטגוריות"), true);
  for (let i = 1; i <= 8; i++) dv(`color${i}`, rangeOf("צבעים"), true);
  dv("fabrics", rangeOf("הרכב בד"), false);
  for (let i = 1; i <= 4; i++) dv(`attr${i}`, rangeOf("מאפיינים"), true);
  if (lists.brands.length) dv("brand", rangeOf("מותגים"), true);
  dv("sizeSystem", rangeOf("סוגי מידות"), true);
  const lookup = `'רשימות'!$${colLetter(lookupCol)}$2:$${colLetter(lookupCol + 1)}$4`;
  dv("sizes", `INDIRECT(VLOOKUP($${keyCol("sizeSystem")}2,${lookup},2,FALSE))`, false);

  const help = wb.addWorksheet("הוראות", { views: [{ rightToLeft: true }] });
  help.columns = [{ width: 110 }];
  [
    'שורה אחת לכל מוצר בגיליון "מוצרים". מספר דגם הוא חובה וייחודי — דגם שכבר קיים באתר יעדכן את המוצר, דגם חדש ייצור מוצר.',
    "קטגוריה 1-4: בכל תא בוחרים ערך מהתפריט (עד 4 לכל מוצר). קטגוריה 1 היא הראשית. אפשר לבחור גם תת-קטגוריה (למשל הנקה) והמוצר ישויך אליה.",
    "צבע 1-8 ומאפיין 1-4: בכל תא בוחרים ערך אחד מהתפריט, ממלאים רק כמה שצריך. הרכב בד: אפשר כמה ערכים מופרדים ב-;.",
    "סוג המידות: אירופאיות / אמריקאיות / SML. רשימת המידות בתא 'מידות זמינות' מותאמת לסוג שנבחר.",
    "מידות זמינות: רשימה (70B; 70C), \"הכול\" לכל המידות של הסוג, או טווח כמו 70-90 B-D (אירופאי: קפיצות של 5, אמריקאי: קפיצות של 2).",
    "צבעים: " + colorNames.join(", "),
    'את הרשימות (מותגים, הרכב בד, מאפיינים, מידות) מנהלים באתר בדף "רשימות לאקסל" ומורידים תבנית חדשה.',
    "העמודות האפורות (מחיר לפני הנחה, מלאי, תג, תת-קטגוריה, מידות שאזלו, פעיל) אופציונליות. מלאי ריק במוצר חדש = 10.",
    'תמונות מעלים אחר כך בדף "העלאת תמונות", כששם הקובץ = מספר הדגם (BR-1001.jpg, BR-1001_2.jpg).',
  ].forEach((t) => help.addRow([t]));

  return wb.xlsx.writeBuffer();
}
