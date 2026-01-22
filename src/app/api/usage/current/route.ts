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
            return NextResponse.json({
                shortLinks: 0,
                qrCodes: 0,
                pages: 0
            });
        }

        // Get current month's start and end
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // Count short links created this month
        const shortLinksCount = await prisma.link.count({
            where: {
                userId: user.id,
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });

        // For QR codes and pages, we would need separate models
        // For now, return 0 or fetch from relevant models if they exist

        return NextResponse.json({
            shortLinks: shortLinksCount,
            qrCodes: 0, // Would need QRCode model
            pages: 0    // Would need Page model
        });

    } catch (error) {
        console.error('Error fetching usage:', error);
        return NextResponse.json({
            shortLinks: 0,
            qrCodes: 0,
            pages: 0
        });
    }
}
