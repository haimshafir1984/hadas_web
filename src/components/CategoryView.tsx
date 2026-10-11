import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";
import { CIRCLES_PRODUCT_IDS } from "@/lib/constants";
import { getIdList, getTexts } from "@/lib/site-texts";
import type { ProductCardData } from "@/lib/types";

function toCardData(p: {
  id: string;
  name: string;
  subcategory: { name: string } | null;
  price: number;
  wasPrice: number | null;
  rating: number;
  ratingCount: number;
  badge: string | null;
  gradientIndex: number;
  images: { url: string }[];
  sizes: string[];
  outOfStockSizes: string[];
  colors: string[];
}): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    subtitle: p.subcategory?.name ?? null,
    price: p.price,
    wasPrice: p.wasPrice,
    rating: p.rating,
    ratingCount: p.ratingCount,
    badge: p.badge,
    gradientIndex: p.gradientIndex,
    images: p.images,
    sizes: p.sizes,
    outOfStockSizes: p.outOfStockSizes,
    colors: p.colors,
  };
}

type ViewQuery = { f?: string; sort?: string };

const SORTS: Record<string, string> = { new: "חדשים", "price-asc": "מחיר: מהנמוך לגבוה", "price-desc": "מחיר: מהגבוה לנמוך" };

const tagsOf = (p: { attributes: string[]; brand: string | null; fabrics: string[] }) => [...p.attributes, ...(p.brand ? [p.brand] : []), ...p.fabrics];

function applyView<T extends { price: number; createdAt: Date; attributes: string[]; brand: string | null; fabrics: string[] }>(items: T[], q: ViewQuery) {
  let out = q.f ? items.filter((p) => tagsOf(p).includes(q.f!)) : items;
  if (q.sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
  else if (q.sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
  else if (q.sort === "new") out = [...out].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return out;
}

function href(base: string, q: ViewQuery) {
  const sp = new URLSearchParams();
  if (q.f) sp.set("f", q.f);
  if (q.sort) sp.set("sort", q.sort);
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}

function SortLinks({ base, q }: { base: string; q: ViewQuery }) {
  return (
    <div className="filters" style={{ marginTop: 6 }}>
      <span style={{ color: "var(--ink-2)", fontSize: 14, alignSelf: "center" }}>מיון:</span>
      {Object.entries(SORTS).map(([k, label]) => (
        <Link key={k} className={`fchip ${q.sort === k ? "on" : ""}`} href={href(base, { ...q, sort: q.sort === k ? undefined : k })}>
          {label}
        </Link>
      ))}
    </div>
  );
}

export default async function CategoryView({ catId, subId, query = {} }: { catId: string; subId?: string; query?: ViewQuery }) {
  const include = { subcategory: true, images: { orderBy: { order: "asc" as const }, take: 1 } };

  if (catId === "sale") {
    const allSale = await prisma.product.findMany({
      where: { wasPrice: { not: null }, isActive: true },
      include,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    const products = applyView(allSale, query);
    return (
      <div className="wrap category-page category-page-modern">
        <div className="crumb">
          <Link href="/">דף הבית</Link> ← מבצעים
        </div>
        <div className="cathead">
          <div>
            <h1>מבצעי סוף עונה</h1>
            <p style={{ color: "var(--ink-2)", margin: "6px 0 0" }}>{(await getTexts())["sale.text"]}</p>
          </div>
          <span className="count">{products.length} פריטים</span>
        </div>
        <SortLinks base="/c/sale" q={query} />
        <div className="grid" style={{ paddingBottom: 60 }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={toCardData(p)} />
          ))}
        </div>
      </div>
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: catId },
    include: { subcategories: { orderBy: { order: "asc" } } },
  });
  if (!category) notFound();

  const inCategory = { isActive: true, OR: [{ categoryId: catId }, { extraCategories: { some: { id: catId } } }] };
  const isCircles = catId === "circles";
  const circlesIds = isCircles ? ((await getIdList("featured.circles")).length ? await getIdList("featured.circles") : CIRCLES_PRODUCT_IDS) : [];
  let allProducts;
  if (isCircles) {
    allProducts = await prisma.product.findMany({
      where: { id: { in: circlesIds }, isActive: true },
      include,
    });
  } else if (subId) {
    const filtered = await prisma.product.findMany({
      where: { subcategoryId: subId, isActive: true },
      include,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    allProducts = filtered.length
      ? filtered
      : await prisma.product.findMany({ where: inCategory, include, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  } else {
    allProducts = await prisma.product.findMany({ where: inCategory, include, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  }

  const filterOptions = Array.from(new Set(allProducts.flatMap((p) => tagsOf(p)))).sort();
  const products = applyView(allProducts, query);
  const base = subId ? `/c/${category.id}/${subId}` : `/c/${category.id}`;
  const activeSub = subId ? category.subcategories.find((s) => s.id === subId) : undefined;
  const title = activeSub ? activeSub.name : category.name;

  return (
    <div className="wrap category-page category-page-modern">
      <div className="crumb">
        <Link href="/">דף הבית</Link> ← <Link href={`/c/${category.id}`}>{category.name}</Link>
        {activeSub ? ` ← ${activeSub.name}` : ""}
      </div>
      <div className="cathead">
        <div>
          <h1>{title}</h1>
          <p style={{ color: "var(--ink-2)", margin: "6px 0 0", maxWidth: "56ch" }}>{category.blurb}</p>
        </div>
        <span className="count">{products.length} פריטים</span>
      </div>
      <div className="filters">
        <Link className={`fchip ${!subId ? "on" : ""}`} href={`/c/${category.id}`}>
          הכול
        </Link>
        {category.subcategories.map((s) => (
          <Link key={s.id} className={`fchip ${subId === s.id ? "on" : ""}`} href={`/c/${category.id}/${s.id}`}>
            {s.name}
          </Link>
        ))}
        {filterOptions.map((x) => (
          <Link key={x} className={`fchip ${query.f === x ? "on" : ""}`} href={href(base, { ...query, f: query.f === x ? undefined : x })}>
            {x}
          </Link>
        ))}
      </div>
      <SortLinks base={base} q={query} />
      <div className="grid" style={{ paddingBottom: 60 }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={toCardData(p)} />
        ))}
        {!products.length && <p style={{ color: "var(--ink-2)" }}>אין מוצרים שמתאימים לסינון.</p>}
      </div>
    </div>
  );
}
