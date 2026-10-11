import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  const guides = await prisma.guide.findMany({ orderBy: { order: "asc" } });
  return (
    <AdminShell
      active="/admin/guides"
      title="מדריכים"
      actions={
        <Link className="btn-v" style={{ borderRadius: 10, padding: "9px 18px", fontSize: 14 }} href="/admin/guides/new">
          + מדריך חדש
        </Link>
      }
    >
      {!guides.length ? (
        <p style={{ color: "var(--ink-2)" }}>אין מדריכים עדיין.</p>
      ) : (
        <div className="tw">
          <table className="atable">
            <thead>
              <tr>
                <th>כותרת</th>
                <th>תקציר</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {guides.map((g) => (
                <tr key={g.id}>
                  <td style={{ fontWeight: 600 }}>{g.title}</td>
                  <td style={{ color: "var(--ink-2)" }}>{g.teaser.slice(0, 90)}</td>
                  <td>
                    <Link className="mini" href={`/admin/guides/${g.id}`}>
                      עריכה
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
