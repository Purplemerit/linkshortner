import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { dummyLinks, dummyTeamMembers } from '@/lib/dummy-data';

export async function GET() {
    try {
        console.log('Test route called');

        try {
            const userCount = await prisma.user.count();
            const linkCount = await prisma.link.count();
            console.log(`User count: ${userCount}, Link count: ${linkCount}`);
            return NextResponse.json({ status: 'ok', userCount, linkCount });
        } catch (dbErr) {
            console.error('DB error fallback:', dbErr);
            // Fallback to dummy counts
            const userCount = dummyTeamMembers.length;
            const linkCount = dummyLinks.length;
            return NextResponse.json({ status: 'ok (fallback)', userCount, linkCount });
        }
    } catch (error) {
        console.error('Test route error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
