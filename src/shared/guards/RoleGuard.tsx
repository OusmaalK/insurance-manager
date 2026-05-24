// src/shared/guards/RoleGuard.tsx
// Guard basé sur les rôles pour les composants
// <80 lignes

'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

// ============================================
// TYPES
// ============================================

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string | string[];
  fallback?: React.ReactNode;
}

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: string | string[];
  fallback?: React.ReactNode;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const RoleGuard = ({ children, roles, fallback = null }: RoleGuardProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return fallback;
  }

  const roleList = Array.isArray(roles) ? roles : [roles];
  const hasRequiredRole = roleList.includes(user.role);

  if (!hasRequiredRole) {
    return fallback;
  }

  return <>{children}</>;
};

// ============================================
// COMPOSANT PERMISSION
// ============================================

export const PermissionGuard = ({ children, permissions, fallback = null }: PermissionGuardProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return fallback;
  }

  const permissionList = Array.isArray(permissions) ? permissions : [permissions];
  
  // Définition des permissions par rôle
  const rolePermissions: Record<string, string[]> = {
    ADMIN: ['all'],
    BROKER: ['view_companies', 'view_policies', 'view_claims', 'create_claims', 'view_reports', 'use_ia'],
    USER: ['view_profile'],
  };

  const userPermissions = rolePermissions[user.role] || [];
  const hasAllPermissions = userPermissions.includes('all');
  const hasRequiredPermissions = hasAllPermissions || permissionList.some(p => userPermissions.includes(p));

  if (!hasRequiredPermissions) {
    return fallback;
  }

  return <>{children}</>;
};

// ============================================
// HOOK UTILITAIRE
// ============================================

export const useRoleGuard = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  const hasRole = (roles: string | string[]): boolean => {
    if (isLoading || !isAuthenticated || !user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  };

  const isAdmin = (): boolean => hasRole('ADMIN');
  const isBroker = (): boolean => hasRole('BROKER');
  const isUser = (): boolean => hasRole('USER');

  const hasPermission = (permissions: string | string[]): boolean => {
    if (isLoading || !isAuthenticated || !user) return false;
    
    const rolePermissions: Record<string, string[]> = {
      ADMIN: ['all'],
      BROKER: ['view_companies', 'view_policies', 'view_claims', 'create_claims', 'view_reports', 'use_ia'],
      USER: ['view_profile'],
    };
    
    const userPermissions = rolePermissions[user.role] || [];
    if (userPermissions.includes('all')) return true;
    
    const permissionList = Array.isArray(permissions) ? permissions : [permissions];
    return permissionList.some(p => userPermissions.includes(p));
  };

  return {
    hasRole,
    hasPermission,
    isAdmin,
    isBroker,
    isUser,
    role: user?.role,
    isAuthenticated,
    isLoading,
  };
};

export default RoleGuard;