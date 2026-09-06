export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  STAFF: "staff",
  CLIENT: "client",
} as const;

// Roles allowed into the internal admin app in Phase 1. Client is an
// external-portal role (see docs/DECISIONS.md) and has no UI here yet.
export const INTERNAL_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF] as const;

// Only these roles may manage the users module.
export const USER_MANAGER_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN] as const;
