import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const domains = await prisma.domain.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(domains);
    } catch (error) {
        console.error('Error fetching domains:', error);
        return NextResponse.json(
            { error: 'Failed to fetch domains' },
            { status: 500 }
        );
    }
}
