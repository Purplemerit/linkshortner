import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await prisma.workspace.findUnique({
      where: { id: params.workspaceId },
      include: {
        members: { where: { userId } }
      }
    });

    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const isMember = workspace.ownerId === userId || workspace.members.length > 0;
    if (!isMember) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    return NextResponse.json(workspace);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workspace' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, settings, color, icon } = body;

    const workspace = await prisma.workspace.findUnique({
      where: { id: params.workspaceId },
      include: { members: { where: { userId } } }
    });

    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    // Only owner or admin (if we had roles refined) can edit. For now owner.
    // Or if member has specific role. Let's strict to owner or owner of team.
    // Workspace ownerId matches user.
    if (workspace.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.workspace.update({
      where: { id: params.workspaceId },
      data: {
        ...(name && { name }),
        ...(settings && { settings }),
        ...(color && { color }),
        ...(icon && { icon })
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workspace' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await prisma.workspace.findUnique({
      where: { id: params.workspaceId }
    });

    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    if (workspace.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.workspace.delete({
      where: { id: params.workspaceId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workspace' }, { status: 500 });
  }
}
