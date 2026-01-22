import { NextResponse } from 'next/server';
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
            }
        });

        if (!user) {
            return NextResponse.json([]);
        }

        // Fetch payment history
        const payments = await prisma.payment.findMany({
            where: {
                userId: user.id,
                status: 'SUCCESS'
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });

        const formattedPayments = payments.map(payment => ({
            id: payment.id,
            date: payment.createdAt.toISOString(),
            description: `Subscription Payment`,
            amount: payment.amount,
            currency: payment.currency
        }));

        return NextResponse.json(formattedPayments);

    } catch (error) {
        console.error('Error fetching payment history:', error);
        return NextResponse.json([]);
    }
}
