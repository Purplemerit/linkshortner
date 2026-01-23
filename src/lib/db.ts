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

        let databaseUrl = process.env.DATABASE_URL;

        // Fix for "prepared statement already exists" error when using connection poolers like PgBouncer
        if (databaseUrl && !databaseUrl.includes('pgbouncer=true') && (databaseUrl.includes('postgres') || databaseUrl.includes('supabase'))) {
            databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
            console.log('Appended pgbouncer=true to DATABASE_URL for connection pooling compatibility');
        }

        return new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            datasources: {
                db: {
                    url: databaseUrl,
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

// Use a lazy-loaded singleton to prevent build-time crashes
let _prisma: PrismaClientSingleton | undefined;

const getPrisma = () => {
    if (!_prisma) {
        _prisma = globalForPrisma.prisma ?? prismaClientSingleton();
        if (process.env.NODE_ENV !== 'production') {
            globalForPrisma.prisma = _prisma;
        }
    }
    return _prisma;
};

// Export a proxy that only initializes Prisma when accessed
const prisma = new Proxy({} as PrismaClientSingleton, {
    get: (target, prop, receiver) => {
        const instance = getPrisma();
        const value = Reflect.get(instance, prop, receiver);
        return typeof value === 'function' ? value.bind(instance) : value;
    },
});

export default prisma;
