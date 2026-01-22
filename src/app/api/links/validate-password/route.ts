import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { code, password } = await request.json();

        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        });

        if (!link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        if (link.password !== password) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }

        // Capture analytics for this password-gated access?
        // Reuse specific analytics logic or just increment click
        await prisma.link.update({
            where: { id: link.id },
            data: { clicks: { increment: 1 } }
        });

        return NextResponse.json({ destination: link.destination });
    } catch (error) {
        return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
    }
}
