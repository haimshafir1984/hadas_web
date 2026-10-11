import AdminShell from "@/components/admin/AdminShell";
import FeaturedForm from "@/components/admin/FeaturedForm";
import { prisma } from "@/lib/prisma";
import { getIdList, getSetting } from "@/lib/site-texts";

export const dynamic = "force-dynamic";

export default async function FeaturedPage() {
  const [products, circles, quiz, heroImage] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, sku: true }, orderBy: { name: "asc" } }),
    getIdList("featured.circles"),
    getIdList("featured.quiz"),
    getSetting("home.hero.image"),
  ]);
  return (
    <AdminShell active="/admin/featured" title="דף הבית והמלצות">
      <FeaturedForm products={products} initial={{ circles, quiz, heroImage }} />
    </AdminShell>
  );
}
