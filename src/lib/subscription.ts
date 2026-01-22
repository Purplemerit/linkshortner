import prisma from '@/lib/db';

export const PLANS = {
    FREE: {
        name: 'FREE',
        price: 0,
        currency: 'INR',
        linksLimit: 100, // per month
        customDomains: 0,
        features: {
            passwordProtection: false,
            apiAccess: false,
            customDomains: 0,
            detailedAnalytics: false,
            teamMembers: 2, // Allow 2 members (Owner + 1 Guest)
        }
    },
    STARTER: {
        name: 'STARTER',
        price: 999, // ₹999/month
        currency: 'INR',
        linksLimit: 2000, // 500 per week = ~2000 per month
        customDomains: 2,
        features: {
            passwordProtection: true,
            apiAccess: true,
            detailedAnalytics: true,
            qrCodes: true,
            teamMembers: 3,
        }
    },
    PROFESSIONAL: {
        name: 'PROFESSIONAL',
        price: 2999, // ₹2999/month
        currency: 'INR',
        linksLimit: 5000,
        customDomains: 10,
        features: {
            passwordProtection: true,
            apiAccess: true,
            detailedAnalytics: true,
            qrCodes: true,
            teamMembers: 10,
            advancedAnalytics: true,
        }
    }
};

export async function getUserPlan(userId: string) {
    const subscription = await prisma.subscription.findFirst({
        where: {
            userId,
            status: 'ACTIVE',
            // Check if not expired
            OR: [
                { endDate: null },
                { endDate: { gt: new Date() } }
            ]
        },
        orderBy: { createdAt: 'desc' } // Get latest
    });

    const planName = subscription?.plan || 'FREE';
    return PLANS[planName as keyof typeof PLANS] || PLANS.FREE;
}

export async function checkLinkLimit(userId: string) {
    const plan = await getUserPlan(userId);

    // Count links created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const linkCount = await prisma.link.count({
        where: {
            userId,
            createdAt: { gte: startOfMonth }
        }
    });

    return linkCount < plan.linksLimit;
}
