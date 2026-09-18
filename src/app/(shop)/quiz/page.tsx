import { prisma } from "@/lib/prisma";
import QuizClient from "@/components/QuizClient";
import { QUIZ_RECOMMENDED_PRODUCT_IDS } from "@/lib/constants";
import type { ProductCardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const products = await prisma.product.findMany({
    where: { id: { in: QUIZ_RECOMMENDED_PRODUCT_IDS } },
    include: { subcategory: true, images: { orderBy: { order: "asc" }, take: 1 } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));
  const recommended: ProductCardData[] = QUIZ_RECOMMENDED_PRODUCT_IDS.map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({
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

  return <QuizClient recommended={recommended} />;
}
