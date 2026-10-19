import { HomeMemberRole } from '../types/enums';

export const PERMISSIONS = {
  MANAGE_HOME: 'manage_home',
  MANAGE_MEMBERS: 'manage_members',
  MANAGE_ASSETS: 'manage_assets',
  MANAGE_DOCUMENTS: 'manage_documents',
  MANAGE_MAINTENANCE: 'manage_maintenance',
  MANAGE_FINANCES: 'manage_finances',
  VIEW_ONLY: 'view_only'
} as const;

export const ROLE_PERMISSIONS: Record<HomeMemberRole, string[]> = {
  [HomeMemberRole.OWNER]: Object.values(PERMISSIONS),
  [HomeMemberRole.ADMIN]: [
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.MANAGE_ASSETS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.MANAGE_MAINTENANCE,
    PERMISSIONS.MANAGE_FINANCES,
    PERMISSIONS.VIEW_ONLY
  ],
  [HomeMemberRole.MEMBER]: [
    PERMISSIONS.MANAGE_ASSETS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.MANAGE_MAINTENANCE,
    PERMISSIONS.VIEW_ONLY
  ],
  [HomeMemberRole.VIEWER]: [
    PERMISSIONS.VIEW_ONLY
  ]
};

export const hasPermission = (role: HomeMemberRole, permission: string): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};
