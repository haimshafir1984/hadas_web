import { buildWorkbook } from "@/lib/import-excel";

export const dynamic = "force-dynamic";

export async function GET() {
  const buf = await buildWorkbook("template");
  return new Response(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="products-template.xlsx"',
    },
  });
}
