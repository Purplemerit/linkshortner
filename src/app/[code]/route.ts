import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { code: string } }
) {
    const code = params.code;

    if (!code) {
        return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    try {
        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        });

        if (!link) {
            return NextResponse.redirect(new URL('/', request.url)); // Or a custom 404 page
        }

        // Async analytics logging (fire and forget)
        // In a real production serverless environment, use Inngest or QStash
        // to ensure this runs reliably. For now, we just await it or let it run.
        await prisma.link.update({
            where: { id: link.id },
            data: {
                clicks: { increment: 1 },
                analytics: {
                    create: {
                        country: request.geo?.country || 'Unknown',
                        city: request.geo?.city || 'Unknown',
                        device: request.headers.get('user-agent') || 'Unknown',
                        referrer: request.headers.get('referer') || 'Direct',
                    },
                },
            },
        });

        return NextResponse.redirect(new URL(link.destination, request.url));
    } catch (error) {
        console.error('Redirection error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}
