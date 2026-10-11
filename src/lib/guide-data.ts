export function guideData(body: Record<string, unknown>) {
  const sections = Array.isArray(body.sections)
    ? (body.sections as unknown[])
        .map((s) => (Array.isArray(s) ? [String(s[0] ?? "").trim(), String(s[1] ?? "").trim()] : null))
        .filter((s): s is string[] => !!s && !!(s[0] || s[1]))
    : [];
  const steps = Array.isArray(body.steps) ? (body.steps as unknown[]).map((x) => String(x).trim()).filter(Boolean) : [];
  return { title: String(body.title ?? "").trim(), teaser: String(body.teaser ?? "").trim(), sections, steps };
}
