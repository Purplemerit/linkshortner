import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';

// Reserved codes that cannot be used
const reservedCodes = ['api', 'dashboard', 'login', 'register', 'admin', 'settings', 'features', 'pricing', 'contact', 'terms', 'privacy', 'docs', 'enterprise', 'comparison', 'blog', 'security', 'self-hosted', 'sign-in', 'sign-up'];

import { getBaseUrl } from '@/lib/baseUrl';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await prisma.link.findMany({
      where: { userId },
      include: { campaign: true },
      orderBy: { createdAt: 'desc' },
    });

    // Format for frontend — build origin using BASE_URL from environment
    const baseUrl = getBaseUrl();
    const formattedLinks = links.map((link: any) => ({
      ...link,
      shortUrl: `${baseUrl}/${link.shortCode}`,
    }));

    return NextResponse.json(formattedLinks);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    console.log('Creates link - userId:', userId);

    // Ensure user exists in database (sync from Clerk if needed)
    if (userId) {
      try {
        // Get full user object to check OAuth accounts
        let user = null;
        try {
          user = await (await clerkClient()).users.getUser(userId);
        } catch (e) {
          console.error('Could not fetch user from Clerk:', e);
        }

        // Check if user is from OAuth provider
        const hasOAuthAccount = user?.externalAccounts && user.externalAccounts.length > 0;

        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        // If user doesn't exist, create them (webhook might have been missed)
        if (!existingUser) {
          console.log('User not found in database, creating:', userId);
          // Fix email extraction for newer Clerk SDK where primaryEmailAddress is an object
          const primaryEmail = user?.primaryEmailAddress?.toString() || (user?.primaryEmailAddress as any)?.emailAddress;
          const email = sessionClaims?.email as string || primaryEmail || `user_${userId}@temp.com`;

          // For OAuth providers, email is automatically verified
          // For email/password, check the email_verified claim
          const emailVerified = hasOAuthAccount || (sessionClaims?.email_verified as boolean) || false;

          await prisma.user.create({
            data: {
              id: userId,
              email,
              emailVerified,
              emailVerifiedAt: emailVerified ? new Date() : null,
            },
          });
          console.log('User created successfully:', userId, 'emailVerified:', emailVerified, 'hasOAuth:', hasOAuthAccount);
        } else if (!existingUser.emailVerified && hasOAuthAccount) {
          // Update existing user if they came from OAuth but weren't marked as verified
          await prisma.user.update({
            where: { id: userId },
            data: {
              emailVerified: true,
              emailVerifiedAt: new Date(),
            },
          });
          console.log('Updated user email verification status for OAuth user:', userId);
        }
      } catch (userError) {
        console.error('Error ensuring user exists:', userError);
        // Don't fail link creation if user sync fails
      }

      // Check if email is verified
      // For OAuth providers, consider them verified automatically
      let emailVerified = sessionClaims?.email_verified as boolean | undefined;

      // If not verified via claims, check if user has OAuth account
      if (!emailVerified) {
        try {
          const user = await (await clerkClient()).users.getUser(userId);
          const hasOAuthAccount = user?.externalAccounts && user.externalAccounts.length > 0;

          if (hasOAuthAccount) {
            emailVerified = true;
            console.log('User has OAuth account, marking as verified:', userId);
          }
        } catch (e) {
          console.error('Could not verify OAuth status:', e);
        }
      }

      // Also check the database to see if user is already marked as verified
      if (!emailVerified) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (dbUser?.emailVerified) {
            emailVerified = true;
            console.log('User is marked as verified in database:', userId);
          }
        } catch (e) {
          console.error('Could not check database verification status:', e);
        }
      }

      if (!emailVerified) {
        // Count existing links for this user
        const userLinkCount = await prisma.link.count({
          where: { userId }
        });

        console.log('Email not verified for user:', userId, 'Link count:', userLinkCount, 'emailVerifiedFromClaims:', sessionClaims?.email_verified);

        // Enforce 2-link limit for unverified users - REMOVED BY REQUEST
        // if (userLinkCount >= 2) { ... }
      }
    }

    const body = await request.json();
    const { destination, customCode, tags, workspaceId, campaignId } = body;

    // Validate URL
    if (!destination || (!destination.startsWith('http://') && !destination.startsWith('https://'))) {
      return NextResponse.json(
        { error: 'Invalid URL (must start with http:// or https://)' },
        { status: 400 }
      );
    }

    // Validate Workspace Access if provided
    if (workspaceId && userId) {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        include: { members: { where: { userId } } }
      });

      if (!workspace) {
        return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
      }

      const isOwner = workspace.ownerId === userId;
      const isMember = workspace.members.length > 0;

      if (!isOwner && !isMember) {
        return NextResponse.json({ error: 'You do not have access to this workspace' }, { status: 403 });
      }
    }

    // Validate Campaign Access if provided
    if (campaignId && userId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      if (campaign.userId !== userId) {
        return NextResponse.json({ error: 'You do not have access to this campaign' }, { status: 403 });
      }
    }

    let shortCode = customCode;

    if (customCode) {
      // Validate custom code
      if (customCode.length < 3 || customCode.length > 50) {
        return NextResponse.json(
          { error: 'Custom code must be between 3 and 50 characters' },
          { status: 400 }
        );
      }
      if (!/^[a-z0-9-]+$/.test(customCode)) {
        return NextResponse.json(
          { error: 'Custom code can only contain lowercase letters, numbers, and hyphens' },
          { status: 400 }
        );
      }
      if (reservedCodes.includes(customCode.toLowerCase())) {
        return NextResponse.json(
          { error: 'This code is reserved' },
          { status: 400 }
        );
      }

      const existing = await prisma.link.findUnique({
        where: { shortCode: customCode }
      });

      if (existing) {
        return NextResponse.json(
          { error: 'This code is already taken' },
          { status: 400 }
        );
      }
    } else {
      // Generate random code using nanoid (collision resistant)
      // We want distinct codes. nanoid(6) is usually enough for millions of links
      shortCode = nanoid(6);

      // Ensure uniqueness (paranoid check)
      let isUnique = false;
      let retries = 0;
      while (!isUnique && retries < 3) {
        const existing = await prisma.link.findUnique({ where: { shortCode } });
        if (!existing) {
          isUnique = true;
        } else {
          shortCode = nanoid(6);
          retries++;
        }
      }

      if (!isUnique) {
        return NextResponse.json(
          { error: 'Failed to generate unique code. Please try again.' },
          { status: 500 }
        );
      }
    }

    // --- FEATURE GATING START ---
    if (userId) {
      // 1. Check Link Limits
      const { checkLinkLimit, getUserPlan } = await import('@/lib/subscription');
      const canCreate = await checkLinkLimit(userId);
      if (!canCreate) {
        return NextResponse.json(
          { error: 'Monthly link limit reached. Please upgrade your plan.' },
          { status: 403 }
        );
      }

      // 2. Check Custom Domain / Code (if requested customCode)
      // If user wants custom code but is on free plan?
      // Actually standard ShortCode is fine. Custom domain logic would be different (in shortUrl construction).
      // But verify features like Tags/Password/Expiry if provided?
      // For now let's just check fundamental limit.
    }
    // --- FEATURE GATING END ---

    const newLink = await prisma.link.create({
      data: {
        shortCode,
        destination,
        user: userId ? { connect: { id: userId } } : undefined,
        tagsJson: tags ? JSON.stringify(tags) : JSON.stringify([]),
        workspaceId: workspaceId || undefined,
        campaignId: campaignId || undefined,
        expiresAt: !userId ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
      },
      // Include campaign in result if possible, but standard result is fine
    });


    const baseUrl = getBaseUrl();
    return NextResponse.json({
      ...newLink,
      shortUrl: `${baseUrl}/${newLink.shortCode}`,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating link:', error);
    const msg = error && (error as any).message ? (error as any).message : String(error);
    const errorCode = (error as any).code;

    // Handle foreign key constraint violation
    if (errorCode === 'P2003' || msg.includes('Foreign key constraint')) {
      console.error('FOREIGN KEY ERROR: User does not exist in database');
      return NextResponse.json({
        error: 'User account not found. Please sign out and sign in again.',
        code: 'USER_NOT_FOUND'
      }, { status: 400 });
    }

    // Better database error formatting
    if (
      msg.includes("Can't reach database server") ||
      msg.includes('PrismaClientInitializationError') ||
      msg.includes('Tenant or user not found')
    ) {
      console.error('DATABASE CONNECTION ERROR: Please check your DATABASE_URL in .env');
      return NextResponse.json({
        error: 'Database connection failed. Please check your credentials.'
      }, { status: 503 });
    }

    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
