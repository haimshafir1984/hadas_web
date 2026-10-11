import ProductDetail, { type ProductDetailData } from "@/components/ProductDetail";
import type { ProductCardData } from "@/lib/types";
import { BRA_SIZE_TABLE, CLOTHING_SIZE_TABLE } from "@/lib/constants";

export default function SketchProduct({
  concept,
  productDetail,
  related,
}: {
  concept: number;
  productDetail: ProductDetailData | null;
  related: ProductCardData[];
}) {
  if (!productDetail) return <div className="wrap">מוצר לדוגמה לא נמצא — צריך לזרוע (seed) את מסד הנתונים.</div>;

  return (
    <div className="sk-page">
      {concept === 2 && <div className="sk-line-path" aria-hidden="true" />}
      {concept === 3 && <div className="sk-texture" aria-hidden="true" />}
      <ProductDetail
        product={productDetail}
        related={related}
        content={{
          perks: ["החלפה והחזרה תוך 14 יום", "ייעוץ מידה חינם בוואטסאפ"],
          shipping: "משלוח שליח עד הבית, איסוף עצמי חינם.",
          reviews: [],
          braRows: BRA_SIZE_TABLE,
          clothingRows: CLOTHING_SIZE_TABLE,
        }}
      />
    </div>
  );
}
