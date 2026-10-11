import CategoryView from "@/components/CategoryView";

export const dynamic = "force-dynamic";

export default async function CategorySubPage({
  params,
  searchParams,
}: {
  params: Promise<{ cat: string; sub: string }>;
  searchParams: Promise<{ f?: string; sort?: string }>;
}) {
  const { cat, sub } = await params;
  return <CategoryView catId={cat} subId={sub} query={await searchParams} />;
}
