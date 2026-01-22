import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { UAParser } from 'ua-parser-js';

// Mark this route as dynamic since we can't statically generate all short codes
export const dynamic = 'force-dynamic';
// Ensure this runs on serverless function, not edge
export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;

    if (!code) {
        return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    try {
        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        });

        if (!link) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Check if link is active
        if (link.active === false) {
            return NextResponse.json({ error: 'Link is disabled' }, { status: 410 });
        }

        // Check expiration
        if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
            return NextResponse.json({ error: 'Link has expired' }, { status: 410 });
        }

        // Check Password Protection
        if (link.password) {
            return NextResponse.redirect(new URL(`/protected/${code}`, request.url));
        }

        // Parse User Agent
        const uaString = request.headers.get('user-agent') || '';
        const parser = new UAParser(uaString);
        const device = parser.getDevice().type || 'desktop'; // 'mobile', 'tablet', etc.
        const browser = parser.getBrowser().name || 'Unknown';
        const os = parser.getOS().name || 'Unknown';

        // Log analytics
        try {
            await prisma.link.update({
                where: { id: link.id },
                data: {
                    clicks: { increment: 1 },
                    analytics: {
                        create: {
                            country: request.geo?.country || 'Unknown',
                            city: request.geo?.city || 'Unknown',
                            device: device,
                            browser: browser,
                            os: os,
                            referrer: request.headers.get('referer') || 'Direct',
                            ipHash: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
                        },
                    },
                },
            });
        } catch (analyticsError) {
            console.error('Failed to log analytics:', analyticsError);
        }

        return NextResponse.redirect(new URL(link.destination, request.url));
    } catch (error) {
        console.error('Redirection error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}
