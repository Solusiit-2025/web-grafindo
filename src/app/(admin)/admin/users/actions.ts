"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";

const ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "SALES", "CUSTOMER"];

export async function createUserAction(formData: FormData): Promise<void> {
  await requireAdmin("ADMIN");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "EDITOR") as Role;

  if (!name || !email || password.length < 8) return;
  if (!ROLES.includes(role)) return;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash, role } });
  revalidatePath("/admin/users");
}
