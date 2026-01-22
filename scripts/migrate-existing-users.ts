import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * One-time migration script to mark all existing users as verified
 * Run this after deploying email verification feature
 *
 * Usage:
 *   npx tsx scripts/migrate-existing-users.ts
 */
async function migrateExistingUsers() {
  console.log('Starting migration of existing users...\n');

  try {
    // Get count of unverified users
    const unverifiedCount = await prisma.user.count({
      where: { emailVerified: false }
    });

    console.log(`Found ${unverifiedCount} unverified users`);

    if (unverifiedCount === 0) {
      console.log('✓ All users are already verified. No migration needed.');
      return;
    }

    // Mark all existing users as verified
    const result = await prisma.user.updateMany({
      where: {
        emailVerified: false,
      },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      }
    });

    console.log(`\n✓ Successfully migrated ${result.count} existing users as verified`);
    console.log('  - emailVerified set to true');
    console.log('  - emailVerifiedAt set to current timestamp');

    // Show summary
    const totalUsers = await prisma.user.count();
    const verifiedUsers = await prisma.user.count({
      where: { emailVerified: true }
    });

    console.log(`\nSummary:`);
    console.log(`  Total users: ${totalUsers}`);
    console.log(`  Verified users: ${verifiedUsers}`);
    console.log(`  Unverified users: ${totalUsers - verifiedUsers}`);

  } catch (error) {
    console.error('\n✗ Error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateExistingUsers()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('\nMigration complete.');
    process.exit(0);
  });
