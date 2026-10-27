import type { Role } from "@prisma/client";

const ROLE_LEVEL: Record<Role, number> = {
  CUSTOMER: 0,
  SALES: 1,
  EDITOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

export function hasRole(userRole: Role, required: Role) {
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[required];
}
