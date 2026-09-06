"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_MANAGER_ROLES = exports.INTERNAL_ROLES = exports.ROLES = void 0;
exports.ROLES = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    STAFF: "staff",
    CLIENT: "client",
};
// Roles allowed into the internal admin app in Phase 1. Client is an
// external-portal role (see docs/DECISIONS.md) and has no UI here yet.
exports.INTERNAL_ROLES = [exports.ROLES.SUPER_ADMIN, exports.ROLES.ADMIN, exports.ROLES.STAFF];
// Only these roles may manage the users module.
exports.USER_MANAGER_ROLES = [exports.ROLES.SUPER_ADMIN, exports.ROLES.ADMIN];
//# sourceMappingURL=roles.js.map