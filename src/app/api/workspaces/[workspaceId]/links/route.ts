import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

import { getBaseUrl } from '@/lib/baseUrl';

export async function GET(
    request: NextRequest,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check access
        const workspace = await prisma.workspace.findUnique({
            where: { id: params.workspaceId },
            include: {
                members: { where: { userId } }
            }
        });

        if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
        const isMember = workspace.ownerId === userId || workspace.members.length > 0;
        if (!isMember) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Fetch links
        const links = await prisma.link.findMany({
            where: { workspaceId: params.workspaceId },
            orderBy: { createdAt: 'desc' }
        });

        const baseUrl = getBaseUrl();
        const formattedLinks = links.map((link: any) => ({
            ...link,
            shortUrl: `${baseUrl}/${link.shortCode}`,
        }));

        return NextResponse.json(formattedLinks);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
    }
}
