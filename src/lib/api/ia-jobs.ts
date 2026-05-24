// src/lib/api/ia-jobs.ts
// API client pour les jobs IA
// <60 lignes

import { apiClient } from '@/modules/api/client/client';

const BASE_URL = '/jobs/ia';

export const iaJobsApi = {
  // Récupérer tous les jobs
  async getJobs(): Promise<any[]> {
    try {
      const response = await apiClient.get(BASE_URL);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get jobs:', error);
      return [];
    }
  },

  // Récupérer un job par ID
  async getJob(jobId: string): Promise<any> {
    try {
      const response = await apiClient.get(`${BASE_URL}/${jobId}`);
      return (response as any).data || response;
    } catch (error) {
      console.error('Failed to get job:', error);
      return null;
    }
  },

  // Démarrer un job
  async startJob(jobId: string): Promise<boolean> {
    try {
      await apiClient.post(`${BASE_URL}/${jobId}/start`);
      return true;
    } catch (error) {
      console.error('Failed to start job:', error);
      return false;
    }
  },

  // Arrêter un job
  async stopJob(jobId: string): Promise<boolean> {
    try {
      await apiClient.post(`${BASE_URL}/${jobId}/stop`);
      return true;
    } catch (error) {
      console.error('Failed to stop job:', error);
      return false;
    }
  },

  // Obtenir l'historique d'exécution d'un job
  async getJobHistory(jobId: string, limit?: number): Promise<any[]> {
    try {
      const url = limit ? `${BASE_URL}/${jobId}/history?limit=${limit}` : `${BASE_URL}/${jobId}/history`;
      const response = await apiClient.get(url);
      if (Array.isArray(response)) return response;
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get job history:', error);
      return [];
    }
  },
};

export default iaJobsApi;