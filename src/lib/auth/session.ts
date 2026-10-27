import { cache } from "react";
import { cookies } from "next/headers";
import type { Role } from "@prisma/client";
import { verifyToken } from "./jwt";
import { hasRole } from "./rbac";

export type AdminSession = {
  userId: string;
  email: string;
  role: Role;
};

const ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "SALES", "CUSTOMER"];

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    const role = String(payload.role ?? "CUSTOMER") as Role;
    if (!ROLES.includes(role)) return null;
    if (!payload.sub || !payload.email) return null;
    return { userId: String(payload.sub), email: String(payload.email), role };
  } catch {
    return null;
  }
});

/**
 * Server-side guard for layouts and server actions.
 * Never rely solely on proxy.ts — that is an optimistic redirect only.
 */
export async function requireAdmin(required: Role = "EDITOR"): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session || !hasRole(session.role, required)) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
