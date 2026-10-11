import { NextRequest, NextResponse } from "next/server";
import { commitRows, parseWorkbook } from "@/lib/import-excel";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "לא נבחר קובץ" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "הקובץ גדול מדי" }, { status: 400 });

  try {
    const rows = await parseWorkbook(Buffer.from(await file.arrayBuffer()));
    const summary = {
      create: rows.filter((r) => r.action === "create").length,
      update: rows.filter((r) => r.action === "update").length,
      error: rows.filter((r) => r.action === "error").length,
    };
    if (form?.get("mode") !== "commit") {
      return NextResponse.json({ rows: rows.map(({ data: _data, ...r }) => r), summary });
    }
    // Only valid rows are written; rows with errors are skipped and reported.
    const result = await commitRows(rows);
    return NextResponse.json({ ...result, skipped: summary.error });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "שגיאה בקריאת הקובץ" }, { status: 400 });
  }
}
