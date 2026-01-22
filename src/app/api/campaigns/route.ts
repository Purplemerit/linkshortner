import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const campaigns = await prisma.campaign.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { links: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, utmSource, utmMedium, utmCampaign } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Safety check for cached Prisma Client
        if (!prisma.campaign) {
            return NextResponse.json({
                error: 'Database update pending. Please STOP and START your server (npm run dev) to enable this feature.'
            }, { status: 503 });
        }

        // Check if campaign name exists for user
        const existing = await prisma.campaign.findUnique({
            where: {
                userId_name: {
                    userId,
                    name
                }
            }
        });

        if (existing) {
            return NextResponse.json({ error: 'Campaign with this name already exists' }, { status: 409 });
        }

        const campaign = await prisma.campaign.create({
            data: {
                userId,
                name,
                utmSource,
                utmMedium,
                utmCampaign: utmCampaign || name.toLowerCase().replace(/\s+/g, '-')
            }
        });

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error('Error creating campaign:', error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}
