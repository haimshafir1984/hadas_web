import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed-data";

export async function POST() {
  await seedDatabase(prisma);
  return NextResponse.json({ ok: true });
}
