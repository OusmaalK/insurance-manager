// src/middleware/auth.middleware.ts
// Guard authentification pour les composants client
// <130 lignes

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// ============================================
// TYPES
// ============================================

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

interface RouteGuardProps {
  children: React.ReactNode;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const AuthGuard = ({ children, allowedRoles, redirectTo = '/login' }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(`${redirectTo}?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (user.role === 'BROKER') {
          router.push('/broker/dashboard');
        } else {
          router.push('/login');
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname, allowedRoles, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

// ============================================
// HOOK PERMISSIONS
// ============================================

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    const rolesList = Array.isArray(role) ? role : [role];
    return rolesList.includes(user.role);
  };

  const isAdmin = (): boolean => user?.role === 'ADMIN';
  const isBroker = (): boolean => user?.role === 'BROKER';
  const isUser = (): boolean => user?.role === 'USER';

  return {
    hasRole,
    isAdmin,
    isBroker,
    isUser,
    role: user?.role,
    isAuthenticated,
  };
};

// ============================================
// COMPOSANT PROTECTION ROUTE
// ============================================

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isBroker = user?.role === 'BROKER';

  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route));

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  if (pathname.startsWith('/admin') && !isAdmin) {
    return <AuthGuard allowedRoles={['ADMIN']}>{children}</AuthGuard>;
  }

  if (pathname.startsWith('/broker') && !isBroker && !isAdmin) {
    return <AuthGuard allowedRoles={['BROKER', 'ADMIN']}>{children}</AuthGuard>;
  }

  return <>{children}</>;
};

// ============================================
// COMPOSANT PROTECTION PAGES SHARED
// ============================================

export const SharedPageGuard = ({ children }: RouteGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;