// src/modules/api/companies/companies.api.ts
// API Client pour le module Companies
// <130 lignes

import { apiClient } from '../client/client';
import { Company, CompanyFormData, CompanyFilters, CompanyRiskAnalysis, CompanyStats, CompanyPredictions } from '@/types/company.types';
import { PaginationParams } from '@/types/api.types';

// ============================================
// CONSTANTES
// ============================================

const BASE_URL = '/companies';

// ============================================
// MÉTHODES CRUD
// ============================================

export const companiesApi = {
  // Liste des entreprises (paginiée)
  async getAll(params?: PaginationParams & CompanyFilters) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.minRiskScore) searchParams.append('minRiskScore', params.minRiskScore.toString());
    if (params?.maxRiskScore) searchParams.append('maxRiskScore', params.maxRiskScore.toString());
    
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    return apiClient.get<{ data: Company[]; total: number; page: number; limit: number; totalPages: number }>(url);
  },

  // Récupérer une entreprise par ID
  async getById(id: number) {
    return apiClient.get<Company>(`${BASE_URL}/${id}`);
  },

  // Créer une entreprise
  async create(data: CompanyFormData) {
    return apiClient.post<Company>(BASE_URL, data);
  },

  // Mettre à jour une entreprise
  async update(id: number, data: Partial<CompanyFormData>) {
    return apiClient.put<Company>(`${BASE_URL}/${id}`, data);
  },

  // Supprimer une entreprise
  async delete(id: number) {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  // Récupérer les statistiques globales
  async getStats(): Promise<CompanyStats> {
    return apiClient.get<CompanyStats>(`${BASE_URL}/stats`);
  },

  // ============================================
  // ANALYSE IA (endpoints backend existants)
  // ============================================

  // Analyse de risque IA (via backend)
  async analyzeRisk(id: number) {
    return apiClient.post<CompanyRiskAnalysis>(`${BASE_URL}/${id}/analyze-risk`);
  },

  // Récupérer le score de risque
  async getRiskScore(id: number) {
    return apiClient.get<{ risk_score: number }>(`${BASE_URL}/${id}/risk-score`);
  },

  // ✅ Obtenir les prédictions IA (renouvellement, sinistre, cross-sell)
  async getPredictions(id: number): Promise<CompanyPredictions> {
    return apiClient.get<CompanyPredictions>(`${BASE_URL}/${id}/predictions`);
  },

  // ✅ Obtenir les prédictions de sinistre
  async getClaimPredictions(id: number) {
    return apiClient.get<{ claim_probability: number; risk_factors: string[] }>(`${BASE_URL}/${id}/claim-predictions`);
  },

  // ✅ Obtenir les recommandations cross-sell
  async getCrossSellRecommendations(id: number) {
    return apiClient.get<{ recommendations: Array<{ product: string; reason: string; potential: number }> }>(`${BASE_URL}/${id}/cross-sell`);
  },

  // Entreprises à haut risque
  async getHighRiskCompanies(threshold: number = 70) {
    return apiClient.get<Company[]>(`${BASE_URL}/high-risk?threshold=${threshold}`);
  },

  // ✅ Entreprises avec prédictions de résiliation
  async getChurnRiskCompanies() {
    return apiClient.get<Company[]>(`${BASE_URL}/churn-risk`);
  },
};

export default companiesApi;