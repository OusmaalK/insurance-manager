// src/hooks/useUsers.ts
// Hook pour la gestion des utilisateurs
// <150 lignes

'use client';

import { useState, useCallback, useEffect } from 'react';
import { usersApi } from '@/modules/api/users/users.api';
import { User, UserFilters, UserStats, UserActivity } from '@/types/user.types';
import { PaginationParams } from '@/types/api.types';

interface UseUsersOptions {
  autoFetch?: boolean;
  initialParams?: PaginationParams & UserFilters;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const { autoFetch = true, initialParams = {} } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  // Récupérer tous les utilisateurs
  const fetchUsers = useCallback(async (fetchParams?: PaginationParams & UserFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await usersApi.getAll(fetchParams || params);
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        if (responseAny.data && Array.isArray(responseAny.data)) {
          setUsers(responseAny.data);
          setTotal(responseAny.total || responseAny.data.length);
          setTotalPages(responseAny.totalPages || 1);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('fetchUsers error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  // Récupérer un utilisateur par ID
  const getUser = useCallback(async (id: number): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await usersApi.getById(id);
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        const userData = responseAny.data || responseAny;
        setUser(userData);
        return userData;
      }
      return null;
    } catch (err: any) {
      setError(err.message || 'Utilisateur non trouvé');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les activités d'un utilisateur
  const getUserActivities = useCallback(async (id: number, limit: number = 50): Promise<UserActivity[] | null> => {
    setIsLoading(true);
    try {
      const response = await usersApi.getActivities(id, limit);
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        const activitiesData = responseAny.data || responseAny;
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        return Array.isArray(activitiesData) ? activitiesData : [];
      }
      return null;
    } catch (err) {
      console.error('getUserActivities error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les statistiques
  const fetchStats = useCallback(async (): Promise<UserStats | null> => {
    setIsLoading(true);
    try {
      const response = await usersApi.getStats();
      if (response && typeof response === 'object') {
        return (response as any).data || response;
      }
      return null;
    } catch (err) {
      console.error('fetchStats error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Créer un utilisateur
  const createUser = useCallback(async (data: any): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await usersApi.create(data);
      if (response && typeof response === 'object') {
        const newUser = (response as any).data || response;
        await fetchUsers();
        return newUser;
      }
      return null;
    } catch (err) {
      console.error('createUser error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers]);

  // Mettre à jour le statut
  const updateStatus = useCallback(async (id: number, status: User['status']): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await usersApi.updateStatus(id, status);
      if (response && typeof response === 'object') {
        const updated = (response as any).data || response;
        await fetchUsers();
        if (user?.id === id) setUser(updated);
        return updated;
      }
      return null;
    } catch (err) {
      console.error('updateStatus error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsers, user]);

  // Mettre à jour les paramètres
  const updateParams = useCallback((newParams: Partial<PaginationParams & UserFilters>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  // Auto-fetch
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  return {
    users,
    user,
    activities,
    total,
    totalPages,
    isLoading,
    error,
    params,
    fetchUsers,
    getUser,
    getUserActivities,
    fetchStats,
    createUser,
    updateStatus,
    updateParams,
  };
};

export default useUsers;