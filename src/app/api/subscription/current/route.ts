import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find the user
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { email: { contains: userId } }
                ]
            },
            include: {
                subscriptions: {
                    where: {
                        status: 'ACTIVE'
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!user) {
            // Return default free plan for new users
            return NextResponse.json({
                plan: 'FREE',
                status: 'ACTIVE',
                startDate: null,
                endDate: null,
                paymentMethod: null
            });
        }

        const activeSubscription = user.subscriptions[0];

        if (!activeSubscription) {
            return NextResponse.json({
                plan: 'FREE',
                status: 'ACTIVE',
                startDate: null,
                endDate: null,
                paymentMethod: null
            });
        }

        return NextResponse.json({
            plan: activeSubscription.plan,
            status: activeSubscription.status,
            startDate: activeSubscription.startDate?.toISOString() || null,
            endDate: activeSubscription.endDate?.toISOString() || null,
            paymentMethod: null // We don't store card details
        });

    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json({
            plan: 'FREE',
            status: 'ACTIVE',
            startDate: null,
            endDate: null,
            paymentMethod: null
        });
    }
}
