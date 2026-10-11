import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import GuideForm from "@/components/admin/GuideForm";

export const dynamic = "force-dynamic";

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await prisma.guide.findUnique({ where: { id } });
  if (!g) notFound();
  return (
    <AdminShell active="/admin/guides" title="עריכת מדריך">
      <GuideForm
        initial={{
          id: g.id,
          title: g.title,
          teaser: g.teaser,
          sections: (g.sections as unknown as [string, string][]) ?? [],
          steps: g.steps,
        }}
      />
    </AdminShell>
  );
}
