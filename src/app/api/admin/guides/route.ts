import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export function guideData(body: Record<string, unknown>) {
  const sections = Array.isArray(body.sections)
    ? (body.sections as unknown[])
        .map((s) => (Array.isArray(s) ? [String(s[0] ?? "").trim(), String(s[1] ?? "").trim()] : null))
        .filter((s): s is string[] => !!s && !!(s[0] || s[1]))
    : [];
  const steps = Array.isArray(body.steps) ? (body.steps as unknown[]).map((x) => String(x).trim()).filter(Boolean) : [];
  return { title: String(body.title ?? "").trim(), teaser: String(body.teaser ?? "").trim(), sections, steps };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const data = guideData(body ?? {});
  if (!data.title) return NextResponse.json({ error: "נא להזין כותרת" }, { status: 400 });
  const order = await prisma.guide.count();
  const g = await prisma.guide.create({ data: { ...data, order } });
  return NextResponse.json({ id: g.id });
}
