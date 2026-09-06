import { PrismaClient } from "@prisma/client";

// Single shared client so we don't exhaust MySQL connections across requests.
export const prisma = new PrismaClient();
