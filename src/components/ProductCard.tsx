"use client";

import Link from "next/link";
import ProductPh from "./ProductPh";
import { discountPct, nis } from "@/lib/format";
import { HeartIcon } from "./icons";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import type { ProductCardData } from "@/lib/types";

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const { show } = useToast();
  const off = discountPct(product.price, product.wasPrice);

  const quickAdd = () => {
    const size = product.sizes.find((s) => !product.outOfStockSizes.includes(s)) ?? product.sizes[0] ?? "מידה אחת";
    const color = product.colors[0] ?? "#F4EFE9";
    addItem(product.id, size, color, 1);
    show("נוסף לסל ✓");
  };

  return (
    <div className="p-card">
      <Link href={`/p/${product.id}`}>
        <ProductPh
          id={product.id}
          name={product.name}
          gradientIndex={product.gradientIndex}
          imageUrl={product.images[0]?.url}
          badge={product.badge}
          sale={!!product.wasPrice}
          isNew={product.badge === "חדש"}
        />
      </Link>
      <button className="heart" aria-label="שמירה למועדפים">
        <HeartIcon />
      </button>
      <div className="p-b">
        <span className="s">{product.subtitle}</span>
        <Link className="n" href={`/p/${product.id}`}>
          {product.name}
        </Link>
        {product.ratingCount ? (
          <div className="stars">
            {"★".repeat(Math.round(product.rating))}
            <span>
              {product.rating} ({product.ratingCount})
            </span>
          </div>
        ) : (
          <div className="stars">
            <span>מוצר חדש</span>
          </div>
        )}
        <div className="prow">
          <span className="now mono">{nis(product.price)}</span>
          {product.wasPrice ? (
            <>
              <span className="was mono">{nis(product.wasPrice)}</span>
              <span className="off">{off}%-</span>
            </>
          ) : null}
        </div>
        <button className="qa" onClick={quickAdd}>
          הוספה מהירה
        </button>
      </div>
    </div>
  );
}
