import { buildWorkbook } from "@/lib/import-excel";

export const dynamic = "force-dynamic";

export async function GET() {
  const buf = await buildWorkbook("export");
  return new Response(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="products-export.xlsx"',
    },
  });
}
