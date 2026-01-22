import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

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

        const domain = await prisma.domain.findUnique({
            where: { id },
        });

        if (!domain) {
            return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
        }

        if (domain.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.domain.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting domain:', error);
        return NextResponse.json(
            { error: 'Failed to delete domain' },
            { status: 500 }
        );
    }
}
