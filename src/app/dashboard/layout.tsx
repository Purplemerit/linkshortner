import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import DashboardClient from './DashboardClient';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Check onboarding status from database
    let dbUser = null;
    try {
        dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { onboardingComplete: true }
        });
    } catch (err) {
        console.error('Dashboard Layout Prisma Error:', err);
        // Fallback: If DB is unreachable, we'll redirect to onboarding to be safe
    }

    // If user doesn't exist or hasn't completed onboarding, redirect them
    if (!dbUser || !dbUser.onboardingComplete) {
        redirect('/onboarding/choose-plan');
    }

    return (
        <DashboardClient>
            {children}
        </DashboardClient>
    );
}
