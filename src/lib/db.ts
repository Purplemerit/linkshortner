import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    try {
        return new PrismaClient();
    } catch (err) {
        console.error('PrismaClient initialization error:', err);
        throw err;
    }
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (!process.env.DATABASE_URL) {
    console.warn('Warning: DATABASE_URL is not set. Prisma will fail to connect in production.\n' +
        'Set DATABASE_URL in your hosting provider (no surrounding quotes).');
}

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
