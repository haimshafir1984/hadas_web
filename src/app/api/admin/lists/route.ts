import { NextRequest, NextResponse } from "next/server";
import { saveLists } from "@/lib/import-lists";

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  await saveLists(body);
  return NextResponse.json({ ok: true });
}
