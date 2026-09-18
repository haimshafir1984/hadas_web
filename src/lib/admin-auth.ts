import { cookies } from "next/headers";

/**
 * Single choke point for admin auth. Intentionally hardcoded to admin/1234
 * to match the approved prototype while the site is still in review with
 * the store owner — see README "TODO: real admin auth" for the swap-in plan.
 */
export const ADMIN_COOKIE_NAME = "parpar_admin_session";
const SESSION_VALUE = "granted";

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === "admin" && password === "1234";
}

export function adminSessionCookieValue(): string {
  return SESSION_VALUE;
}

export async function checkAdminAuth(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === SESSION_VALUE;
}
