import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TEXT_DEFS } from "@/lib/site-texts";

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const values: Record<string, unknown> = body?.values ?? {};

  for (const def of TEXT_DEFS) {
    if (!(def.key in values)) continue;
    const value = String(values[def.key] ?? "");
    if (value.trim() === "" || value === def.default) {
      await prisma.siteText.deleteMany({ where: { key: def.key } });
    } else {
      await prisma.siteText.upsert({ where: { key: def.key }, update: { value }, create: { key: def.key, value } });
    }
  }
  return NextResponse.json({ ok: true });
}
