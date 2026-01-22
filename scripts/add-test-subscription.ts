import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'harshvardhansinghha@gmail.com';

    console.log(`🔍 Looking for user with email: ${email}`);

    // Find user by email
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if (!user) {
        console.log('❌ User not found. Please sign up first with this email.');
        console.log('📝 Steps:');
        console.log('   1. Go to http://localhost:3000/sign-up');
        console.log('   2. Create an account with: harshvardhansinghha@gmail.com');
        console.log('   3. Run this script again');
        return;
    }

    console.log(`✅ Found user: ${user.id}`);
    console.log(`📧 Email: ${email}`);

    // Check if subscription already exists
    const existingSubscription = await prisma.subscription.findFirst({
        where: {
            userId: user.id,
            status: 'ACTIVE'
        }
    });

    if (existingSubscription) {
        console.log('⚠️  Active subscription already exists. Updating it...');

        const updated = await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
                plan: 'PROFESSIONAL',
                status: 'ACTIVE',
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            }
        });

        console.log('✅ Subscription updated to PROFESSIONAL plan!');
        console.log(`📅 Valid until: ${updated.endDate?.toLocaleDateString() || 'N/A'}`);
    } else {
        // Create new subscription
        const subscription = await prisma.subscription.create({
            data: {
                userId: user.id,
                plan: 'PROFESSIONAL',
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            }
        });

        console.log('✅ PROFESSIONAL subscription created!');
        console.log(`📅 Valid until: ${subscription.endDate?.toLocaleDateString() || 'N/A'}`);
    }

    console.log('\n🎉 All done! You now have access to all PROFESSIONAL features:');
    console.log('   ✓ 5000 links/month');
    console.log('   ✓ Custom domains');
    console.log('   ✓ API access');
    console.log('   ✓ Password protection');
    console.log('   ✓ Advanced analytics');
    console.log('   ✓ Team collaboration (when implemented)');
    console.log('\n🔗 Visit: http://localhost:3000/dashboard');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
