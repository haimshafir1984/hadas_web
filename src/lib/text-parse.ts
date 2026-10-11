// Pure helpers (safe for client and server) that turn the admin's plain-text fields into structured data.

export const lines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

export function parseTable(text: string, cols: number): string[][] {
  return lines(text)
    .map((l) => l.split("|").map((c) => c.trim()))
    .filter((r) => r.length >= cols)
    .map((r) => r.slice(0, cols));
}

export type Review = { name: string; stars: number; when: string; text: string };

// "שם|כוכבים|זמן|טקסט"
export function parseReviews(text: string): Review[] {
  return lines(text)
    .map((l) => l.split("|").map((c) => c.trim()))
    .filter((r) => r.length >= 4)
    .map((r) => ({ name: r[0], stars: Math.max(1, Math.min(5, Number(r[1]) || 5)), when: r[2], text: r.slice(3).join("|") }));
}

export type QuizStep = { q: string; a: string[] };

// "שאלה|תשובה|תשובה|..."
export function parseQuiz(text: string): QuizStep[] {
  return lines(text)
    .map((l) => l.split("|").map((c) => c.trim()).filter(Boolean))
    .filter((r) => r.length >= 3)
    .map((r) => ({ q: r[0], a: r.slice(1) }));
}

export const tableToText = (rows: string[][]) => rows.map((r) => r.join("|")).join("\n");
export const quizToText = (steps: QuizStep[]) => steps.map((s) => [s.q, ...s.a].join("|")).join("\n");
