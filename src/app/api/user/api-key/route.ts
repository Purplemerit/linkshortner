import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

// Helper function to check if email is verified
// If user is authenticated and in middleware, they're verified (OAuth sync or email verified)
async function isEmailVerified(userId: string): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            // User not in database yet, but they're authenticated
            // Middleware will sync OAuth users immediately, so if they're here, they're verified
            console.log('[API Route] User not in DB yet, assuming verified (middleware will sync)');
            return true;
        }

        // Return verified status from database
        return user.emailVerified || false;
    } catch (error) {
        console.error('[API Route] Error checking email verification:', error);
        // If there's an error, assume verified to not block authenticated users
        return true;
    }
}

export async function GET(req: NextRequest) {
    try {
        console.log('[API Route] GET /api/user/api-key - Starting');
        const { userId } = await auth();

        console.log('[API Route] userId:', userId);

        if (!userId) {
            console.log('[API Route] No userId found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check email verification (middleware should have already synced OAuth status)
        const emailVerified = await isEmailVerified(userId);
        console.log('[API Route] Email verified:', emailVerified);

        if (!emailVerified) {
            console.log('[API Route] Email not verified, but proceeding for UX (User Request)');
            // return NextResponse.json({
            //     error: 'Please verify your email to generate API keys',
            //     requiresVerification: true
            // }, { status: 403 });
        }

        // Find or create user record in database
        let dbUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!dbUser) {
            console.log('[API Route] Creating new DB user');
            dbUser = await prisma.user.create({
                data: {
                    id: userId,
                    email: `${userId}@oauth`,
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                    apiKey: `sk_${crypto.randomBytes(24).toString('hex')}`,
                },
            });
        }

        // If existing user has no API key, generate one now
        if (!dbUser.apiKey) {
            console.log('[API Route] Generating API key for user');
            dbUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    apiKey: `sk_${crypto.randomBytes(24).toString('hex')}`,
                }
            });
        }

        console.log('[API Route] Returning API key successfully');
        return NextResponse.json({
            apiKey: dbUser.apiKey,
            apiCalls: dbUser.apiCalls || 0
        });
    } catch (error) {
        console.error('[API Route] Error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to fetch API key. Please try again.'
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        console.log('[API Route] POST /api/user/api-key - Starting');
        const { userId } = await auth();

        console.log('[API Route] userId:', userId);

        if (!userId) {
            console.log('[API Route] No userId found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check email verification (middleware should have already synced OAuth status)
        const emailVerified = await isEmailVerified(userId);
        console.log('[API Route] Email verified:', emailVerified);

        if (!emailVerified) {
            console.log('[API Route] Email not verified, but proceeding for UX');
            // return NextResponse.json({
            //     error: 'Please verify your email to regenerate API keys',
            //     requiresVerification: true
            // }, { status: 403 });
        }

        const newKey = `sk_${crypto.randomBytes(24).toString('hex')}`;
        console.log('[API Route] Regenerating API key for user');

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { apiKey: newKey },
        });

        console.log('[API Route] API key regenerated successfully');
        return NextResponse.json({ apiKey: updatedUser.apiKey });
    } catch (error) {
        console.error('[API Route] Error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to regenerate API key. Please try again.'
        }, { status: 500 });
    }
}
