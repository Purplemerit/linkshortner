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
    let connectionError = false;

    try {
        dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { onboardingComplete: true }
        });
    } catch (err) {
        console.error('Dashboard Layout Connection Error:', err);
        connectionError = true;
    }

    // ONLY redirect if we successfully queried the DB and found it's incomplete.
    // If the DB is down (connectionError), we'll let the page load so components 
    // can show their own localized error states rather than looping the user.
    if (!connectionError && (!dbUser || !dbUser.onboardingComplete)) {
        redirect('/onboarding/choose-plan');
    }

    return (
        <DashboardClient>
            {children}
        </DashboardClient>
    );
}
