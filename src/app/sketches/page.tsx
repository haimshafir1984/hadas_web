import { prisma } from "@/lib/prisma";
import { getTexts } from "@/lib/site-texts";
import SketchGallery from "./SketchGallery";
import type { ProductCardData } from "@/lib/types";

export const dynamic = "force-dynamic";

const withSubs = { subcategories: { orderBy: { order: "asc" as const } } };

function toCard(p: {
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

export default async function SketchesPage() {
  const [bras, under, cloth, circles, guides, t, catProducts, product, relatedRaw] = await Promise.all([
    prisma.category.findUnique({ where: { id: "bras" }, include: withSubs }),
    prisma.category.findUnique({ where: { id: "under" }, include: withSubs }),
    prisma.category.findUnique({ where: { id: "cloth" }, include: withSubs }),
    prisma.category.findUnique({ where: { id: "circles" }, include: withSubs }),
    prisma.guide.findMany({ orderBy: { order: "asc" } }),
    getTexts(),
    prisma.product.findMany({
      where: { categoryId: "bras" },
      include: { subcategory: true, images: { orderBy: { order: "asc" }, take: 1 } },
    }),
    prisma.product.findUnique({
      where: { id: "b1" },
      include: { category: true, images: { orderBy: { order: "asc" } } },
    }),
    prisma.product.findMany({
      where: { categoryId: "bras", id: { not: "b1" } },
      include: { subcategory: true, images: { orderBy: { order: "asc" }, take: 1 } },
      take: 4,
    }),
  ]);

  const categories = { bras, under, cloth, circles };
  const products = catProducts.map(toCard);
  const related = relatedRaw.map(toCard);
  const productDetail = product
    ? {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        categoryName: product.category.name,
        price: product.price,
        wasPrice: product.wasPrice,
        rating: product.rating,
        ratingCount: product.ratingCount,
        stock: product.stock,
        description: product.description,
        features: product.features,
        colors: product.colors,
        sizes: product.sizes,
        outOfStockSizes: product.outOfStockSizes,
        badge: product.badge,
        gradientIndex: product.gradientIndex,
        images: product.images,
      }
    : null;

  return (
    <SketchGallery
      categories={categories}
      guides={guides}
      texts={t}
      categoryName={bras?.name ?? "חזיות"}
      categoryBlurb={bras?.blurb ?? ""}
      products={products}
      productDetail={productDetail}
      related={related}
    />
  );
}
