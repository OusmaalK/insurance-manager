// src/shared/guards/AuthGuard.tsx
// Guard d'authentification pour les pages protégées
// <100 lignes

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

// ============================================
// TYPES
// ============================================

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRoles?: string[];
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const AuthGuard = ({ children, redirectTo = '/login', requiredRoles }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Non authentifié → redirection vers login
      if (!isAuthenticated) {
        router.push(`${redirectTo}?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      // Vérification des rôles requis
      if (requiredRoles && requiredRoles.length > 0 && user) {
        if (!requiredRoles.includes(user.role)) {
          // Redirection selon le rôle
          if (user.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else if (user.role === 'BROKER') {
            router.push('/broker/dashboard');
          } else {
            router.push('/unauthorized');
          }
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname, redirectTo, requiredRoles]);

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Vérification des accès..." />
      </div>
    );
  }

  // Non authentifié → ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Vérification des rôles
  if (requiredRoles && requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-500 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <button
            onClick={() => router.push(user?.role === 'ADMIN' ? '/admin/dashboard' : '/broker/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ============================================
// VARIANTS PRÉ-DÉFINIES
// ============================================

export const AdminGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requiredRoles={['ADMIN']}>{children}</AuthGuard>
);

export const BrokerGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requiredRoles={['BROKER', 'ADMIN']}>{children}</AuthGuard>
);

export const UserGuard = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard>{children}</AuthGuard>
);

export default AuthGuard;