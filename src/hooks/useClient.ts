// src/hooks/useClient.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Types
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  birthDate: string;
  profession: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  policiesCount?: number;
  totalPremium?: number;
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  birthDate: string;
  profession: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  status?: 'active' | 'inactive' | 'pending';
}

interface UseClientOptions {
  autoFetch?: boolean;
  initialPage?: number;
  initialLimit?: number;
}

export function useClient(options: UseClientOptions = {}) {
  const { autoFetch = false, initialPage = 1, initialLimit = 10 } = options;
  
  const [clients, setClients] = useState<Client[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Récupérer tous les clients
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/clients`, {
        params: { page, limit, search: searchQuery }
      });
      
      setClients(response.data.data || response.data);
      setTotal(response.data.total || response.data.length);
    } catch (err) {
      console.error('Erreur fetchClients:', err);
      setError('Impossible de récupérer la liste des clients');
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, page, limit, searchQuery]);

  // Récupérer un client par ID
  const fetchClientById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    setClient(null);
    
    try {
      const response = await axios.get(`${API_URL}/clients/${id}`);
      setClient(response.data);
      return response.data;
    } catch (err) {
      console.error('Erreur fetchClientById:', err);
      setError('Client non trouvé');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // Créer un client
  const createClient = useCallback(async (data: CreateClientData): Promise<Client | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/clients`, data);
      const newClient = response.data;
      setClients(prev => [newClient, ...prev]);
      return newClient;
    } catch (err) {
      console.error('Erreur createClient:', err);
      setError('Impossible de créer le client');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // Mettre à jour un client
  const updateClient = useCallback(async (id: string, data: UpdateClientData): Promise<Client | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${API_URL}/clients/${id}`, data);
      const updatedClient = response.data;
      
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      if (client?.id === id) setClient(updatedClient);
      
      return updatedClient;
    } catch (err) {
      console.error('Erreur updateClient:', err);
      setError('Impossible de mettre à jour le client');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, client?.id]);

  // Supprimer un client
  const deleteClient = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${API_URL}/clients/${id}`);
      setClients(prev => prev.filter(c => c.id !== id));
      if (client?.id === id) setClient(null);
      return true;
    } catch (err) {
      console.error('Erreur deleteClient:', err);
      setError('Impossible de supprimer le client');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, client?.id]);

  // Rechercher des clients
  const searchClients = useCallback(async (query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  // Exporter les clients
  const exportClients = useCallback(async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/clients/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clients.${format === 'csv' ? 'csv' : format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      console.error('Erreur exportClients:', err);
      setError('Impossible d\'exporter les clients');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // Statistiques des clients
  const getClientStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/clients/stats`);
      return response.data;
    } catch (err) {
      console.error('Erreur getClientStats:', err);
      setError('Impossible de récupérer les statistiques');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // Auto-fetch au montage
  useEffect(() => {
    if (autoFetch) {
      fetchClients();
    }
  }, [autoFetch, fetchClients]);

  // Re-fetch quand page, limit ou searchQuery change
  useEffect(() => {
    if (autoFetch) {
      fetchClients();
    }
  }, [page, limit, searchQuery, autoFetch, fetchClients]);

  return {
    // State
    clients,
    client,
    isLoading,
    error,
    page,
    limit,
    total,
    searchQuery,
    
    // Actions
    fetchClients,
    fetchClientById,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
    exportClients,
    getClientStats,
    
    // Setters
    setPage,
    setLimit,
    setSearchQuery,
  };
}

// Hook pour un client spécifique (simplifié)
export function useClientById(id: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await axios.get(`${API_URL}/clients/${id}`);
      setClient(response.data);
    } catch (err) {
      console.error('Erreur fetchClient:', err);
      setError('Client non trouvé');
      setClient(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return {
    client,
    isLoading,
    error,
    refetch: fetchClient,
  };
}

// Hook pour les statistiques des clients
export function useClientStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await axios.get(`${API_URL}/clients/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Erreur fetchStats:', err);
      setError('Impossible de récupérer les statistiques');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}