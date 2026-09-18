import CategoryView from "@/components/CategoryView";

export const dynamic = "force-dynamic";

export default async function CategorySubPage({ params }: { params: Promise<{ cat: string; sub: string }> }) {
  const { cat, sub } = await params;
  return <CategoryView catId={cat} subId={sub} />;
}
