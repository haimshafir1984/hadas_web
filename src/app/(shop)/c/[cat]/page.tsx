import CategoryView from "@/components/CategoryView";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ cat: string }>;
  searchParams: Promise<{ f?: string; sort?: string }>;
}) {
  const { cat } = await params;
  return <CategoryView catId={cat} query={await searchParams} />;
}
