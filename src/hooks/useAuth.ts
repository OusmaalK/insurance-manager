// src/hooks/useAuth.ts
// Version complète avec création des cookies
'use client';

import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/modules/api/auth/auth.api';
import { LoginCredentials, SessionUser, AuthState } from '@/types/user.types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const mapToSessionUser = (user: any): SessionUser => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name || user.firstName,
  lastName: user.last_name || user.lastName,
  role: user.role,
  isActive: user.is_active === true || user.is_active === 1,
});

// Helper pour créer les cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  console.log(`🍪 Cookie créé: ${name}=${value}`);
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(initialState);
  const [error, setError] = useState<string | null>(null);

  // Charger l'utilisateur depuis les cookies
  useEffect(() => {
    const loadUserFromCookies = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Vérifier si token existe dans les cookies
      const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
      
      if (!token) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      
      try {
        const response = await authApi.getCurrentUser();
        
        if (response && typeof response === 'object') {
          const responseAny = response as any;
          let userData = null;
          
          if (responseAny.success && responseAny.data) {
            userData = responseAny.data;
          } else if (responseAny.id) {
            userData = responseAny;
          }
          
          if (userData) {
            const sessionUser = mapToSessionUser(userData);
            setState({ user: sessionUser, isAuthenticated: true, isLoading: false });
            return;
          }
        }
        
        setState({ user: null, isAuthenticated: false, isLoading: false });
      } catch (error) {
        console.error('Load user error:', error);
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    loadUserFromCookies();
  }, []);

  // Connexion - Version qui crée LES COOKIES
  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      console.log('🔐 Tentative de connexion pour:', credentials.email);
      
      const response = await authApi.login(credentials);
      
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        
        if (responseAny.success === true && responseAny.data) {
          const { access_token, user } = responseAny.data;
          
          if (access_token && user) {
            // ✅ CRÉER LES COOKIES ICI
            setCookie('access_token', access_token, 7);
            setCookie('user_role', user.role, 7);
            
            console.log('✅ Cookies créés avec succès');
            console.log('🍪 access_token:', access_token.substring(0, 20) + '...');
            console.log('🍪 user_role:', user.role);
            
            const sessionUser = mapToSessionUser(user);
            setState({ user: sessionUser, isAuthenticated: true, isLoading: false });
            
            // Redirection
            const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/broker/dashboard';
            console.log('🚀 Redirection vers:', redirectPath);
            
            setTimeout(() => {
              window.location.href = redirectPath;
            }, 100);
            
            return { success: true };
          }
        }
      }
      
      setError('Identifiants invalides');
      return { success: false, error: 'Identifiants invalides' };
    } catch (err: any) {
      console.error('❌ Erreur login:', err);
      const errorMsg = err.message || 'Une erreur est survenue';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Supprimer les cookies
    deleteCookie('access_token');
    deleteCookie('user_role');
    
    setState({ user: null, isAuthenticated: false, isLoading: false });
    setError(null);
    
    window.location.href = '/auth/login';
  }, []);

  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (!state.user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(state.user.role);
  }, [state.user]);

  const isAdmin = useCallback((): boolean => state.user?.role === 'ADMIN', [state.user]);
  const isBroker = useCallback((): boolean => state.user?.role === 'BROKER', [state.user]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error,
    login,
    logout,
    hasRole,
    isAdmin,
    isBroker,
  };
};

export default useAuth;