// src/app/auth/login/hooks/useLoginHandler.ts
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLoginStore } from '../store/loginStore';
import type { LoginCredentials } from '../types';

export function useLoginHandler() {
  const router = useRouter();
  const { login } = useAuth();
  const { setLoading, setError, clearError } = useLoginStore();

  const handleLogin = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    clearError();

    try {
      console.log('🔐 Tentative de connexion pour:', credentials.email);
      
      // Le login dans useAuth gère déjà la redirection !
      // Il ne retourne pas de rôle, juste success/error
      const result = await login(credentials);

      console.log('📦 Résultat login:', result);

      if (!result.success) {
        setError(result.error || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      // ✅ Si on arrive ici, la connexion a réussi
      // La redirection est déjà gérée par useAuth.ts
      // On laisse le hook faire son travail
      console.log('✅ Connexion réussie - Redirection gérée par useAuth');
      
    } catch (err) {
      console.error('💥 Erreur login:', err);
      setError('Une erreur est survenue');
      setLoading(false);
    }
    // Ne pas setLoading(false) ici car useAuth gère déjà l'état
  }, [login, setLoading, setError, clearError]);

  const handleDemoSelect = useCallback((email: string, password: string): void => {
    console.log('🖱️ Démo sélectionnée:', email);
    handleLogin({ email, password });
  }, [handleLogin]);

  return {
    handleLogin,
    handleDemoSelect,
  };
}