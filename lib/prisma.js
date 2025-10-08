import { PrismaClient } from "@prisma/client";

export const prisma =
    globalThis.prisma ||
    new PrismaClient({
        log: ["error", "warn"],
    });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
