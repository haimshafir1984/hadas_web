// Swap-with-neighbour reordering for lists that carry an integer `order` column.
// Re-indexes the whole list first so duplicate/zero orders can never block a move.
export function reorderIds(ids: string[], id: string, move: "up" | "down"): string[] | null {
  const i = ids.indexOf(id);
  const j = move === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return null;
  const next = [...ids];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
