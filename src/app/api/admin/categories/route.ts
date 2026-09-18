import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return base || `cat-${Date.now().toString(36)}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "נא להזין שם" }, { status: 400 });

  let id = slugify(name);
  if (await prisma.category.findUnique({ where: { id } })) {
    id = `${id}-${Date.now().toString(36)}`;
  }
  const count = await prisma.category.count();
  const category = await prisma.category.create({ data: { id, name, blurb: "", order: count } });

  return NextResponse.json({ id: category.id });
}
