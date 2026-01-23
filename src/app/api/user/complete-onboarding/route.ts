import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            console.error('Onboarding Error: No userId or clerkUser');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json().catch(() => ({}));
        const { plan, claimLinkId } = body;
        const email = clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
            console.error('Onboarding Error: No email for user', userId);
            return NextResponse.json({ error: 'No email found' }, { status: 400 });
        }

        console.log('Completing onboarding for:', { userId, email });


        // 1. Check if another user record already has this email
        // This is common if a user was invited or created via webhook before logging in
        const existingEmailUser = await prisma.user.findUnique({
            where: { email }
        });

        let user;
        if (existingEmailUser && existingEmailUser.id !== userId) {
            console.warn('Email conflict detected. Transferring data to current userId:', { from: existingEmailUser.id, to: userId });

            // Reassign links from old record to new ID
            await prisma.link.updateMany({
                where: { userId: existingEmailUser.id },
                data: { userId: userId }
            });

            // Delete the old record after transferring data (or just update its ID if possible)
            // But updating @id is restricted in many DBs. Easier to delete and upsert.
            try {
                await prisma.user.delete({ where: { id: existingEmailUser.id } });
            } catch (e) {
                console.error('Failed to cleanup orphan user record:', e);
            }
        }

        // 1.5 Claim an anonymous link if requested
        if (claimLinkId) {
            try {
                // Only claim if it was anonymous (userId is null)
                await prisma.link.update({
                    where: { id: claimLinkId, userId: null },
                    data: {
                        userId: userId,
                        expiresAt: null // Remove the 24h expiration
                    }
                });
                console.log('Claimed anonymous link:', claimLinkId, 'for user:', userId);
            } catch (claimError) {
                console.error('Failed to claim link:', claimError);
                // Non-fatal error
            }
        }

        // 2. Upsert the current user record
        user = await prisma.user.upsert({
            where: { id: userId },
            update: {
                onboardingComplete: true,
                email: email,
                name: clerkUser.fullName || clerkUser.firstName || ''
            },
            create: {
                id: userId,
                email: email,
                name: clerkUser.fullName || clerkUser.firstName || '',
                onboardingComplete: true
            }
        });

        // 3. For FREE plan, ensure a subscription record exists
        if (plan === 'FREE') {
            await prisma.subscription.upsert({
                where: { razorpaySubId: `free_${userId}` }, // Use a unique fake ID for free
                update: {
                    status: 'ACTIVE',
                    plan: 'FREE'
                },
                create: {
                    userId: userId,
                    plan: 'FREE',
                    status: 'ACTIVE',
                    razorpaySubId: `free_${userId}`
                }
            });
        }


        console.log('Onboarding complete successful:', user.id);
        return NextResponse.json({ success: true, onboardingComplete: true });

    } catch (error) {
        console.error('Error in complete-onboarding API:', error);
        return NextResponse.json({
            error: 'Failed to complete onboarding',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
