import CategoryView from "@/components/CategoryView";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  return <CategoryView catId={cat} />;
}
