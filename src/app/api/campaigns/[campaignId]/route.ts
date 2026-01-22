import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { campaignId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const campaign = await prisma.campaign.findUnique({
            where: {
                id: params.campaignId,
            },
            include: {
                links: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!campaign) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        if (campaign.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        return NextResponse.json(campaign);
    } catch (error) {
        console.error('Error fetching campaign:', error);
        return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { campaignId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify ownership
        const campaign = await prisma.campaign.findUnique({ where: { id: params.campaignId } });
        if (!campaign || campaign.userId !== userId) {
            return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
        }

        await prisma.campaign.delete({
            where: { id: params.campaignId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
