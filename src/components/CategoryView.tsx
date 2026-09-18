import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";
import { CIRCLES_PRODUCT_IDS } from "@/lib/constants";
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

export default async function CategoryView({ catId, subId }: { catId: string; subId?: string }) {
  const include = { subcategory: true, images: { orderBy: { order: "asc" as const }, take: 1 } };

  if (catId === "sale") {
    const products = await prisma.product.findMany({
      where: { wasPrice: { not: null } },
      include,
      orderBy: { createdAt: "desc" },
    });
    return (
      <div className="wrap">
        <div className="crumb">
          <Link href="/">דף הבית</Link> ← מבצעים
        </div>
        <div className="cathead">
          <div>
            <h1>מבצעי סוף עונה</h1>
            <p style={{ color: "var(--ink-2)", margin: "6px 0 0" }}>עד 35% הנחה. המלאי במידות הפופולריות אוזל מהר.</p>
          </div>
          <span className="count">{products.length} פריטים</span>
        </div>
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

  const isCircles = catId === "circles";
  let products;
  if (isCircles) {
    products = await prisma.product.findMany({
      where: { id: { in: CIRCLES_PRODUCT_IDS } },
      include,
    });
  } else if (subId) {
    const filtered = await prisma.product.findMany({
      where: { categoryId: catId, subcategoryId: subId },
      include,
    });
    products = filtered.length
      ? filtered
      : await prisma.product.findMany({ where: { categoryId: catId }, include });
  } else {
    products = await prisma.product.findMany({ where: { categoryId: catId }, include });
  }

  const activeSub = subId ? category.subcategories.find((s) => s.id === subId) : undefined;
  const title = activeSub ? activeSub.name : category.name;

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">דף הבית</Link> ← <Link href={`/c/${category.id}`}>{category.name}</Link>
        {activeSub ? ` ← ${activeSub.name}` : ""}
      </div>
      <div className="cathead">
        <div>
          <h1>{title}</h1>
          <p style={{ color: "var(--ink-2)", margin: "6px 0 0", maxWidth: "56ch" }}>{category.blurb}</p>
        </div>
        <span className="count">{products.length} פריטים · מיון: הכי נמכרים ▾</span>
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
        {catId === "bras" &&
          ["ללא חישוק", "ריפוד עדין", "פושאפ"].map((x) => (
            <Link key={x} className="fchip" href="/c/bras">
              {x}
            </Link>
          ))}
      </div>
      <div className="grid" style={{ paddingBottom: 60 }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={toCardData(p)} />
        ))}
      </div>
    </div>
  );
}
