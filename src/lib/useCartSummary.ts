"use client";

import { useEffect, useState } from "react";
import { useCart } from "./cart-context";
import type { CartSummaryResponse } from "./types";

export function useCartSummary() {
  const { items } = useCart();
  const [summary, setSummary] = useState<CartSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/cart-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then((r) => r.json())
      .then((data: CartSummaryResponse) => {
        if (!cancelled) setSummary(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [items]);

  return { summary, loading };
}
