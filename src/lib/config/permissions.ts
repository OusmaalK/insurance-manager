// src/lib/config/permissions.ts
// Configuration des permissions
// <80 lignes

export type Permission = 
  | 'view_companies'
  | 'manage_companies'
  | 'view_policies'
  | 'manage_policies'
  | 'view_claims'
  | 'manage_claims'
  | 'view_reports'
  | 'generate_reports'
  | 'view_users'
  | 'manage_users'
  | 'view_settings'
  | 'manage_settings'
  | 'view_ia_analysis'
  | 'manage_ia_settings'
  | 'view_audit_logs'
  | 'use_ia_assistant'
  | 'view_commissions'
  | 'manage_webhooks';

export const rolePermissions: Record<string, Permission[]> = {
  ADMIN: [
    'view_companies', 'manage_companies',
    'view_policies', 'manage_policies',
    'view_claims', 'manage_claims',
    'view_reports', 'generate_reports',
    'view_users', 'manage_users',
    'view_settings', 'manage_settings',
    'view_ia_analysis', 'manage_ia_settings',
    'view_audit_logs', 'use_ia_assistant',
    'view_commissions', 'manage_webhooks',
  ],
  BROKER: [
    'view_companies', 'view_policies', 'manage_policies',
    'view_claims', 'manage_claims', 'view_reports',
    'generate_reports', 'view_ia_analysis', 'use_ia_assistant',
    'view_commissions',
  ],
  USER: [
    'view_companies',
  ],
};

export const permissionsConfig = {
  roles: {
    ADMIN: 'ADMIN',
    BROKER: 'BROKER',
    USER: 'USER',
  },
  
  getPermissionsForRole: (role: string): Permission[] => {
    return rolePermissions[role] || [];
  },
  
  hasPermission: (role: string, permission: Permission): boolean => {
    return rolePermissions[role]?.includes(permission) || false;
  },
  
  hasAnyPermission: (role: string, permissions: Permission[]): boolean => {
    const userPermissions = rolePermissions[role] || [];
    return permissions.some(p => userPermissions.includes(p));
  },
  
  hasAllPermissions: (role: string, permissions: Permission[]): boolean => {
    const userPermissions = rolePermissions[role] || [];
    return permissions.every(p => userPermissions.includes(p));
  },
};

export default permissionsConfig;