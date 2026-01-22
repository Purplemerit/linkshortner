import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- AUTOMATIC INVITATION CLAIMING ---
    // Check if the current user has any pending invitations matching their email
    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();
    const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;

    if (userEmail) {
      // Find team memberships where status is 'invited' and email matches, but userId is null
      const pendingInvites = await prisma.teamMember.findMany({
        where: {
          invitedEmail: userEmail,
          userId: null,
          status: 'invited'
        }
      });

      if (pendingInvites.length > 0) {
        console.log(`Claiming ${pendingInvites.length} invites for ${userEmail} (${userId})`);

        // Link these invites to the actual user and mark as active
        // But first ensure the user exists in our DB (redundant check but safe)
        const dbUser = await prisma.user.findUnique({ where: { id: userId } });
        if (dbUser) {
          for (const invite of pendingInvites) {
            await prisma.teamMember.update({
              where: { id: invite.id },
              data: {
                userId: userId,
                status: 'active',
                joinedAt: new Date()
              }
            });
          }
        }
      }
    }
    // --- END CLAIMING ---

    // Get teams where user is owner or member
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, email: true, name: true } }
          }
        },
        workspaces: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Ensure User exists in DB (Sync with Clerk)
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      // Fetch user details from Clerk
      const { currentUser } = await import('@clerk/nextjs/server');
      const clerkUser = await currentUser();

      if (clerkUser) {
        await prisma.user.create({
          data: {
            id: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          }
        });
      } else {
        // Should not happen if auth() returned userId
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    // Check Subscription Plan
    const { getUserPlan } = await import('@/lib/subscription');
    const plan = await getUserPlan(userId);

    // For Free plan, limit to 1 team. For others (Starter/Pro), we assume unlimited for now.
    if (plan.name === 'FREE') {
      const existingTeamsCount = await prisma.team.count({ where: { ownerId: userId } });
      if (existingTeamsCount >= 1) {
        return NextResponse.json(
          { error: 'Free plan is limited to 1 team. Please upgrade to create more teams.' },
          { status: 403 }
        );
      }
    }

    // Check if slug is unique
    const existingTeam = await prisma.team.findUnique({
      where: { slug }
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'Team slug already exists' },
        { status: 400 }
      );
    }

    // Create team
    const team = await prisma.team.create({
      data: {
        name,
        description,
        slug,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'owner'
          }
        }
      },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, email: true, name: true } }
          }
        }
      }
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}
