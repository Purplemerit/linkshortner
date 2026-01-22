/**
 * Role-Based Access Control (RBAC) utilities
 * Defines permissions for each role
 */

export type Role = 'owner' | 'admin' | 'editor' | 'viewer';

export const rolePermissions: Record<Role, Set<string>> = {
  owner: new Set([
    'view_workspace',
    'edit_workspace',
    'delete_workspace',
    'manage_members',
    'view_activity_logs',
    'create_links',
    'edit_links',
    'delete_links',
    'view_analytics',
    'manage_team_settings',
    'invite_members',
    'remove_members',
    'change_member_roles'
  ]),
  admin: new Set([
    'view_workspace',
    'edit_workspace',
    'manage_members',
    'view_activity_logs',
    'create_links',
    'edit_links',
    'delete_links',
    'view_analytics',
    'invite_members',
    'remove_members'
  ]),
  editor: new Set([
    'view_workspace',
    'view_activity_logs',
    'create_links',
    'edit_links',
    'delete_links',
    'view_analytics'
  ]),
  viewer: new Set([
    'view_workspace',
    'view_analytics'
  ])
};

export function hasPermission(role: Role, permission: string): boolean {
  return rolePermissions[role]?.has(permission) ?? false;
}

export function canPerformAction(role: Role, action: string): boolean {
  const actions: Record<Role, string[]> = {
    owner: ['create', 'read', 'update', 'delete', 'manage'],
    admin: ['create', 'read', 'update', 'delete'],
    editor: ['create', 'read', 'update'],
    viewer: ['read']
  };

  return actions[role]?.includes(action) ?? false;
}

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    owner: 'Owner',
    admin: 'Admin',
    editor: 'Editor',
    viewer: 'Viewer'
  };
  return labels[role] || role;
}

export function getRoleDescription(role: Role): string {
  const descriptions: Record<Role, string> = {
    owner: 'Full control over workspace and team settings',
    admin: 'Can manage members and create/edit/delete links',
    editor: 'Can create, edit, and delete links',
    viewer: 'Read-only access to workspace and analytics'
  };
  return descriptions[role] || '';
}

export const roleHierarchy: Record<Role, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1
};

export function canChangeRole(currentRole: Role, targetRole: Role): boolean {
  // Only higher role can change lower role
  return roleHierarchy[currentRole] > roleHierarchy[targetRole];
}
