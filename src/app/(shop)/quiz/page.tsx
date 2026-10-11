import { prisma } from "@/lib/prisma";
import QuizClient from "@/components/QuizClient";
import { QUIZ_RECOMMENDED_PRODUCT_IDS, QUIZ_STEPS } from "@/lib/constants";
import { getIdList, getTexts } from "@/lib/site-texts";
import { parseQuiz } from "@/lib/text-parse";
import type { ProductCardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const picked = await getIdList("featured.quiz");
  const ids = picked.length ? picked : QUIZ_RECOMMENDED_PRODUCT_IDS;
  const t = await getTexts();
  const parsed = parseQuiz(t["quiz.steps"]);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    include: { subcategory: true, images: { orderBy: { order: "asc" }, take: 1 } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));
  const recommended: ProductCardData[] = ids.map((id) => byId.get(id))
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

  return <QuizClient recommended={recommended} steps={parsed.length ? parsed : QUIZ_STEPS} />;
}
