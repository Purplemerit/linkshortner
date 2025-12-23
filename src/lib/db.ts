import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    try {
        if (!process.env.DATABASE_URL) {
            console.error('CRITICAL: DATABASE_URL environment variable is not set!');
            console.error('Please set DATABASE_URL in your Vercel environment variables.');
            console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('VERCEL')));
            throw new Error('DATABASE_URL is not configured');
        }

        console.log('Initializing Prisma Client...');
        console.log('DATABASE_URL configured: YES');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Running on Vercel:', process.env.VERCEL || 'NO');

        return new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
            // Optimize for serverless
            errorFormat: 'minimal',
        });
    } catch (err) {
        console.error('PrismaClient initialization error:', err);
        console.error('Error details:', {
            name: err instanceof Error ? err.name : 'Unknown',
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
        });
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
