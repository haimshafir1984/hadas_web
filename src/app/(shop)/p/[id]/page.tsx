import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetail from "@/components/ProductDetail";
import type { ProductCardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, images: { orderBy: { order: "asc" } } },
  });
  if (!product) notFound();

  const relatedRaw = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { subcategory: true, images: { orderBy: { order: "asc" }, take: 1 } },
    take: 4,
  });

  const related: ProductCardData[] = relatedRaw.map((p) => ({
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
  }));

  return (
    <ProductDetail
      product={{
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
      }}
      related={related}
    />
  );
}
