
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const link = await prisma.link.findUnique({
            where: { id },
        });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        if (link.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Add full shortUrl for convenience
        const protocol = request.headers.get('x-forwarded-proto') || 'https';
        const host = request.headers.get('host') || '';
        const origin = `${protocol}://${host}`;

        return NextResponse.json({
            ...link,
            shortUrl: `${origin}/${link.shortCode}`
        });

    } catch (error) {
        console.error('Error fetching link:', error);
        return NextResponse.json(
            { error: 'Failed to fetch link' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const link = await prisma.link.findUnique({
            where: { id },
        });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        if (link.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.link.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json(
            { error: 'Failed to delete link' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { destination, tags, active, password, expiresAt, notes } = body;

        const link = await prisma.link.findUnique({
            where: { id },
        });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        if (link.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Validations
        if (destination && (!destination.startsWith('http://') && !destination.startsWith('https://'))) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const updatedLink = await prisma.link.update({
            where: { id },
            data: {
                destination: destination || undefined,
                tagsJson: tags ? JSON.stringify(tags) : undefined,
                active: active !== undefined ? active : undefined,
                password: password === null ? null : (password || undefined),
                notes: notes === null ? null : (notes || undefined),
                expiresAt: expiresAt === null ? null : (expiresAt || undefined),
            }
        });

        return NextResponse.json(updatedLink);

    } catch (error) {
        console.error('Error updating link:', error);
        return NextResponse.json(
            { error: 'Failed to update link' },
            { status: 500 }
        );
    }
}
