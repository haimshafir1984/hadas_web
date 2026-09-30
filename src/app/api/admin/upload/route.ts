import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 8 * 1024 * 1024;

const SUPABASE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "product-images";

async function uploadToSupabase(file: File, filename: string, buffer: Buffer) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY)
    ?.trim()
    .replace(/^['"]|['"]$/g, "");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase Storage לא מוגדר: חסרים SUPABASE_URL או SUPABASE_SERVICE_ROLE_KEY");
  }

  const authHeaders: Record<string, string> = {
    apikey: serviceRoleKey,
    "Content-Type": file.type,
    "Cache-Control": "public, max-age=31536000, immutable",
    "x-upsert": "false",
  };

  // Legacy Supabase service-role keys are JWTs. New `sb_secret_...` keys
  // must be sent as `apikey` and must not be put in a Bearer header.
  if (serviceRoleKey.startsWith("eyJ")) {
    authHeaders.Authorization = `Bearer ${serviceRoleKey}`;
  }

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${SUPABASE_BUCKET}/${encodeURIComponent(filename)}`,
    {
      method: "POST",
      headers: authHeaders,
      body: new Uint8Array(buffer),
    },
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Supabase Storage upload failed (${response.status}): ${details.slice(0, 300)}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${SUPABASE_BUCKET}/${encodeURIComponent(filename)}`;
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });

  const files = form.getAll("file").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "לא נבחר קובץ" }, { status: 400 });

  const useLocalStorage = process.env.NODE_ENV !== "production" && !process.env.SUPABASE_SERVICE_ROLE_KEY;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (useLocalStorage) await mkdir(uploadsDir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) return NextResponse.json({ error: `סוג קובץ לא נתמך: ${file.type}` }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "הקובץ גדול מ-8MB" }, { status: 400 });

    const filename = `${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    if (useLocalStorage) {
      await writeFile(path.join(uploadsDir, filename), buffer);
      urls.push(`/uploads/${filename}`);
    } else {
      urls.push(await uploadToSupabase(file, filename, buffer));
    }
  }

  return NextResponse.json({ urls });
}
