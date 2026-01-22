import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserPlan } from '@/lib/subscription';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const plan = await getUserPlan(userId);
        return NextResponse.json(plan);
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
