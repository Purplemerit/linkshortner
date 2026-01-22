import prisma from '@/lib/db';

export type ActivityAction =
  | 'link_created'
  | 'link_updated'
  | 'link_deleted'
  | 'team_created'
  | 'team_updated'
  | 'team_deleted'
  | 'member_added'
  | 'member_removed'
  | 'member_role_changed'
  | 'workspace_created'
  | 'workspace_updated'
  | 'workspace_deleted'
  | 'password_protected'
  | 'analytics_viewed';

export type ActivityResourceType = 'link' | 'team' | 'workspace' | 'member' | 'user';

interface LogActivityParams {
  userId: string;
  action: ActivityAction;
  resourceType: ActivityResourceType;
  resourceId?: string;
  resourceName?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity({
  userId,
  action,
  resourceType,
  resourceId,
  resourceName,
  changes,
  metadata,
  ipAddress,
  userAgent
}: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId,
        resourceName,
        changes: changes ? JSON.stringify(changes) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown'
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw, logging failure shouldn't break the application
  }
}

export async function getUserActivityLogs(
  userId: string,
  limit: number = 50,
  offset: number = 0
) {
  try {
    return await prisma.activityLog.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });
  } catch (error) {
    console.error('Failed to fetch activity logs:', error);
    return [];
  }
}

export async function getResourceActivityLogs(
  resourceType: ActivityResourceType,
  resourceId: string,
  limit: number = 50
) {
  try {
    return await prisma.activityLog.findMany({
      where: {
        resourceType,
        resourceId
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });
  } catch (error) {
    console.error('Failed to fetch resource activity logs:', error);
    return [];
  }
}

export function getActivityLabel(action: ActivityAction): string {
  const labels: Record<ActivityAction, string> = {
    link_created: 'Link created',
    link_updated: 'Link updated',
    link_deleted: 'Link deleted',
    team_created: 'Team created',
    team_updated: 'Team updated',
    team_deleted: 'Team deleted',
    member_added: 'Member added',
    member_removed: 'Member removed',
    member_role_changed: 'Member role changed',
    workspace_created: 'Workspace created',
    workspace_updated: 'Workspace updated',
    workspace_deleted: 'Workspace deleted',
    password_protected: 'Password protection toggled',
    analytics_viewed: 'Analytics viewed'
  };
  return labels[action] || action;
}

export function getActivityIcon(action: ActivityAction): string {
  const icons: Record<ActivityAction, string> = {
    link_created: '🔗',
    link_updated: '✏️',
    link_deleted: '🗑️',
    team_created: '👥',
    team_updated: '⚙️',
    team_deleted: '❌',
    member_added: '👤➕',
    member_removed: '👤➖',
    member_role_changed: '🔄',
    workspace_created: '📁',
    workspace_updated: '📝',
    workspace_deleted: '🗑️',
    password_protected: '🔒',
    analytics_viewed: '📊'
  };
  return icons[action] || '📌';
}
