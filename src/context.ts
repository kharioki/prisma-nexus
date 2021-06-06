import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ["query"] });

interface Context {
    prisma: PrismaClient;
}

export function createContext(): Context {
    return { prisma };
}
