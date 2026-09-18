export type NavSubcategory = {
  id: string;
  name: string;
};

export type NavCategory = {
  id: string;
  name: string;
  subs: NavSubcategory[];
};

export type CartSummaryLine = {
  index: number;
  productId: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  price: number;
  lineTotal: number;
  gradientIndex: number;
  image: string | null;
};

export type CartSummaryResponse = {
  lines: CartSummaryLine[];
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingOver: number;
  shippingCost: number;
  remainingForFreeShipping: number;
  progressPct: number;
};

export type ProductCardData = {
  id: string;
  name: string;
  subtitle: string | null;
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
};
