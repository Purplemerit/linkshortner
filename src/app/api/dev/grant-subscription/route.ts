import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

// DEVELOPMENT ONLY: Grant PROFESSIONAL plan for testing
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('🔍 Granting PROFESSIONAL subscription to:', user.emailAddresses[0]?.emailAddress);

        // Check if user already has an active subscription
        const existingSubscription = await prisma.subscription.findFirst({
            where: {
                userId,
                status: 'ACTIVE',
            },
        });

        if (existingSubscription) {
            // Update existing subscription to PROFESSIONAL
            const updated = await prisma.subscription.update({
                where: { id: existingSubscription.id },
                data: {
                    plan: 'PROFESSIONAL',
                    status: 'ACTIVE',
                    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Subscription upgraded to PROFESSIONAL!',
                subscription: {
                    plan: updated.plan,
                    status: updated.status,
                    validUntil: updated.endDate?.toLocaleDateString() || 'N/A',
                },
            });
        }

        // Create new PROFESSIONAL subscription
        const subscription = await prisma.subscription.create({
            data: {
                userId,
                plan: 'PROFESSIONAL',
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            },
        });

        return NextResponse.json({
            success: true,
            message: 'PROFESSIONAL subscription created!',
            subscription: {
                plan: subscription.plan,
                status: subscription.status,
                validUntil: subscription.endDate?.toLocaleDateString() || 'N/A',
            },
            features: [
                '✓ 5000 links per month',
                '✓ Custom domains',
                '✓ API access',
                '✓ Password protection',
                '✓ Advanced analytics',
                '✓ Priority support',
            ],
        });
    } catch (error) {
        console.error('Error creating test subscription:', error);
        return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
        );
    }
}
