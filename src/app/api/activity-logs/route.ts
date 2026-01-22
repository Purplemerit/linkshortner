import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const resourceType = searchParams.get('resourceType');
    const action = searchParams.get('action');

    const where: any = { userId };

    if (resourceType) where.resourceType = resourceType;
    if (action) where.action = action;

    const logs = await prisma.activityLog.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });

    const total = await prisma.activityLog.count({ where });

    return NextResponse.json({
      logs,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
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
    const {
      action,
      resourceType,
      resourceId,
      resourceName,
      changes,
      metadata
    } = body;

    if (!action || !resourceType) {
      return NextResponse.json(
        { error: 'action and resourceType are required' },
        { status: 400 }
      );
    }

    // Get IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const log = await prisma.activityLog.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId,
        resourceName,
        changes: changes ? JSON.stringify(changes) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress,
        userAgent
      },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Error creating activity log:', error);
    return NextResponse.json(
      { error: 'Failed to create activity log' },
      { status: 500 }
    );
  }
}
