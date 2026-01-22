import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has access to team
    const team = await prisma.team.findUnique({
      where: { id: params.teamId }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isMember = team.ownerId === userId || 
                     (await prisma.teamMember.findFirst({
                       where: { userId, teamId: params.teamId }
                     })) !== null;

    if (!isMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const members = await prisma.teamMember.findMany({
      where: { teamId: params.teamId },
      include: {
        user: { select: { id: true, email: true, name: true } }
      },
      orderBy: { joinedAt: 'desc' }
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const team = await prisma.team.findUnique({
      where: { id: params.teamId }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Only owner and admin can add members
    const currentUserRole = team.ownerId === userId ? 'owner' : 
      (await prisma.teamMember.findFirst({
        where: { userId, teamId: params.teamId }
      }))?.role;

    if (!['owner', 'admin'].includes(currentUserRole || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, role = 'editor' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email (this assumes email exists in your system)
    const newUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!newUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already member
    const existing = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: newUser.id,
          teamId: params.teamId
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'User is already a member' },
        { status: 400 }
      );
    }

    // Add member
    const member = await prisma.teamMember.create({
      data: {
        userId: newUser.id,
        teamId: params.teamId,
        role,
        status: 'active',
        invitedBy: userId
      },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}
