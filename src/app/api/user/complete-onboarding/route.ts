import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan } = await request.json();
        const email = clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
            return NextResponse.json({ error: 'No email found' }, { status: 400 });
        }

        // Find or create user
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { email: email }
                ]
            }
        });

        if (!user) {
            // Create user with onboarding complete
            user = await prisma.user.create({
                data: {
                    id: userId,
                    email: email,
                    name: clerkUser.fullName || clerkUser.firstName || '',
                    onboardingComplete: true
                }
            });
        } else {
            // Update existing user
            user = await prisma.user.update({
                where: { id: user.id },
                data: { onboardingComplete: true }
            });
        }

        // If a paid plan was selected and we don't have a subscription yet, it will be created by the payment verification endpoint
        // For free plan, we don't need to do anything else

        return NextResponse.json({ success: true, user: { id: user.id, onboardingComplete: true } });

    } catch (error) {
        console.error('Error completing onboarding:', error);
        return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
    }
}
