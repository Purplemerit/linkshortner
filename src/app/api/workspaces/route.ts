import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, teamId } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // If teamId is provided, verify ownership/membership
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { members: { where: { userId } } }
      });

      const isOwner = team?.ownerId === userId;
      const isMember = team?.members.length && team.members.length > 0;

      if (!isOwner && !isMember) {
        return NextResponse.json({ error: 'You do not have permission to add workspace to this team' }, { status: 403 });
      }
    }

    // Check slug uniqueness (globally or per team scope? Schema says @@unique([slug, teamId]), wait schema says @@unique([slug, teamId]) for Workspace)
    // Actually schema says:
    // model Workspace {
    //   slug String
    //   @@unique([slug, teamId])
    // }
    // So slug only needs to be unique WITHIN the team.
    // If teamId is null (personal workspace), then slug must be unique where teamId is null.

    // Check if slug exists for this team (or no team)
    const existing = await prisma.workspace.findFirst({
      where: {
        slug,
        teamId: teamId || null
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Workspace slug already exists in this scope' }, { status: 409 });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        teamId: teamId || null, // Optional team association
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'owner'
          }
        }
      }
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
}
