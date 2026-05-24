// src/hooks/useCompanies.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Company, CompanyFilters, CompanyRiskAnalysis, CompanyStats } from '@/types/company.types';
import { PaginationParams } from '@/types/api.types';

// Données mockées
const mockCompanies: Company[] = [
  { id: 1, name: 'AXA France', siret: '12345678901234', email: 'contact@axa.fr', phone: '0123456789', address: '1 rue de Paris', city: 'Paris', postal_code: '75001', activity_sector: 'Assurance', employee_count: 12000, annual_revenue: 45000000, status: 'ACTIVE', risk_score: 15, fraud_score: 5, loyalty_score: 92, created_at: '2024-01-15T00:00:00Z', updated_at: '2026-05-01T00:00:00Z' },
  { id: 2, name: 'Allianz', siret: '98765432109876', email: 'contact@allianz.fr', phone: '0123456788', address: '2 rue de Lyon', city: 'Lyon', postal_code: '69001', activity_sector: 'Assurance', employee_count: 8500, annual_revenue: 38000000, status: 'ACTIVE', risk_score: 25, fraud_score: 8, loyalty_score: 88, created_at: '2024-02-20T00:00:00Z', updated_at: '2026-05-01T00:00:00Z' },
  { id: 3, name: 'Generali', siret: '45678912304567', email: 'contact@generali.fr', phone: '0123456787', address: '3 rue de Marseille', city: 'Marseille', postal_code: '13001', activity_sector: 'Assurance', employee_count: 5200, annual_revenue: 22000000, status: 'ACTIVE', risk_score: 45, fraud_score: 12, loyalty_score: 75, created_at: '2024-03-10T00:00:00Z', updated_at: '2026-05-01T00:00:00Z' },
];

const mockStats: CompanyStats = {
  total: 124,
  avgRiskScore: 35,
  fraudAlerts: 3,
  aiAnalysisCount: 156,
  activeCompanies: 98,
  inactiveCompanies: 26,
  suspendedCompanies: 0,
  riskDistribution: { low: 45, medium: 35, high: 15, critical: 5 },
  topSectors: [{ sector: 'Assurance', count: 45, avgRisk: 32 }, { sector: 'Mutuelle', count: 28, avgRisk: 38 }],
  recentAnalyses: 42,
  lastUpdated: new Date().toISOString(),
};

export const useCompanies = (options: { autoFetch?: boolean } = {}) => {
  const { autoFetch = true } = options;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCompanies = useCallback(async (params?: PaginationParams & CompanyFilters) => {
    setIsLoading(true);
    setError(null);
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 500));
    setCompanies(mockCompanies);
    setTotal(mockCompanies.length);
    setIsLoading(false);
  }, []);

  const getCompany = useCallback(async (id: number): Promise<Company | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const found = mockCompanies.find(c => c.id === id) || null;
    setCompany(found);
    setIsLoading(false);
    return found;
  }, []);

  const fetchCompaniesStats = useCallback(async (): Promise<CompanyStats | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
    return mockStats;
  }, []);

  const analyzeRisk = useCallback(async (id: number): Promise<CompanyRiskAnalysis | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    return {
      company_id: id,
      risk_score: 35,
      risk_level: 'MEDIUM',
      factors: [{ name: 'Secteur', impact: 35, description: 'Secteur à risque modéré' }],
      recommendations: ['Surveillance recommandée'],
      analyzed_at: new Date().toISOString(),
    };
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCompanies();
    }
  }, [autoFetch, fetchCompanies]);

  return {
    companies,
    company,
    isLoading,
    error,
    total,
    fetchCompanies,
    getCompany,
    fetchCompaniesStats,
    analyzeRisk,
  };
};

export default useCompanies;