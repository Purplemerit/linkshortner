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
    const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { onboardingComplete: true }
    });

    // If user doesn't exist or hasn't completed onboarding, redirect them
    // Note: If user doesn't exist in DB, they definitely haven't completed onboarding
    if (!dbUser || !dbUser.onboardingComplete) {
        redirect('/onboarding/choose-plan');
    }

    return (
        <DashboardClient>
            {children}
        </DashboardClient>
    );
}
