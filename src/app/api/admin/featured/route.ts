import { NextRequest, NextResponse } from "next/server";
import { setSetting } from "@/lib/site-texts";

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  const ids = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
  await setSetting("featured.circles", ids(body.circles).length ? JSON.stringify(ids(body.circles)) : "");
  await setSetting("featured.quiz", ids(body.quiz).length ? JSON.stringify(ids(body.quiz)) : "");
  await setSetting("home.hero.image", typeof body.heroImage === "string" ? body.heroImage : "");
  return NextResponse.json({ ok: true });
}
