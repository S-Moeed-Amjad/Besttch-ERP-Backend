"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Single shared client so we don't exhaust MySQL connections across requests.
exports.prisma = new client_1.PrismaClient();
//# sourceMappingURL=prisma.js.map