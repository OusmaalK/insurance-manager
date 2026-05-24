// src/hooks/usePermissions.ts
// Hook pour les permissions
// <70 lignes

'use client';

import { useAuth } from './useAuth';

interface Permissions {
  canViewCompanies: boolean;
  canManageCompanies: boolean;
  canViewPolicies: boolean;
  canManagePolicies: boolean;
  canViewClaims: boolean;
  canManageClaims: boolean;
  canViewReports: boolean;
  canGenerateReports: boolean;
  canViewIA: boolean;
  canManageIA: boolean;
}

const rolePermissions: Record<string, Partial<Permissions>> = {
  ADMIN: {
    canViewCompanies: true,
    canManageCompanies: true,
    canViewPolicies: true,
    canManagePolicies: true,
    canViewClaims: true,
    canManageClaims: true,
    canViewReports: true,
    canGenerateReports: true,
    canViewIA: true,
    canManageIA: true,
  },
  BROKER: {
    canViewCompanies: true,
    canManageCompanies: false,
    canViewPolicies: true,
    canManagePolicies: true,
    canViewClaims: true,
    canManageClaims: true,
    canViewReports: true,
    canGenerateReports: true,
    canViewIA: true,
    canManageIA: false,
  },
  USER: {
    canViewCompanies: false,
    canManageCompanies: false,
    canViewPolicies: false,
    canManagePolicies: false,
    canViewClaims: false,
    canManageClaims: false,
    canViewReports: false,
    canGenerateReports: false,
    canViewIA: false,
    canManageIA: false,
  },
};

export const usePermissions = () => {
  const { user, isAdmin, isBroker } = useAuth();
  const role = user?.role || 'USER';
  
  const permissions = rolePermissions[role] || rolePermissions.USER;
  
  const hasPermission = (permission: keyof Permissions): boolean => {
    return !!permissions[permission];
  };
  
  const hasAnyPermission = (permissionList: (keyof Permissions)[]): boolean => {
    return permissionList.some(p => hasPermission(p));
  };
  
  const hasAllPermissions = (permissionList: (keyof Permissions)[]): boolean => {
    return permissionList.every(p => hasPermission(p));
  };
  
  return {
    ...permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: isAdmin(),
    isBroker: isBroker(),
    role,
  };
};

export default usePermissions;