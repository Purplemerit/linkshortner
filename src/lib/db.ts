import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    try {
        if (!process.env.DATABASE_URL) {
            console.error('CRITICAL: DATABASE_URL environment variable is not set!');
            console.error('Please set DATABASE_URL in your Vercel environment variables.');
            console.error('Current DATABASE_URL:', process.env.DATABASE_URL);
            throw new Error('DATABASE_URL is not configured');
        }

        console.log('Initializing Prisma Client...');
        console.log('DATABASE_URL configured:', process.env.DATABASE_URL ? 'YES' : 'NO');

        return new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
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

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
