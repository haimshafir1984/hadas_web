import { readFile } from "fs/promises";
import path from "path";

// Serves files from UPLOAD_DIR. `next start` does not pick up files added to /public after startup,
// so uploads on a VPS volume are streamed through this route instead.
const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const m = /^[A-Za-z0-9-]+\.(jpg|png|webp|gif|svg)$/.exec(name);
  if (!m) return new Response("Not found", { status: 404 });

  const dir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
  try {
    const data = await readFile(path.join(dir, name));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[m[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
        // an uploaded SVG opened directly must not be able to run scripts
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
