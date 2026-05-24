// src/app/admin/companies/page.tsx
// Page administrateur - Gestion des entreprises avec IA transversale
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CompanyList } from '@/components/admin/companies/CompanyList';
import { CompanyForm } from '@/components/admin/companies/CompanyForm';
import { CompanyRiskScore } from '@/components/admin/companies/CompanyRiskScore';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Modal } from '@/shared/ui/Modal';
import { useCompanies } from '@/hooks/useCompanies';

// Icônes
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Brain, 
  Sparkles,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  X,
  Plus,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';

// Types pour les statistiques
interface DashboardStats {
  total: number;
  avgRiskScore: number;
  fraudAlerts: number;
  aiAnalysisCount: number;
}

// Composant StatsCards
const StatsCards = ({ stats, isLoading }: { stats: DashboardStats | null; isLoading: boolean }) => {
  const cards = [
    { 
      title: 'Total entreprises', 
      value: stats?.total?.toLocaleString() || '0', 
      icon: Building2, 
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true
    },
    { 
      title: 'Risque moyen', 
      value: `${stats?.avgRiskScore || 0}%`, 
      icon: Shield, 
      color: 'bg-amber-500',
      trend: '-5%',
      trendUp: false
    },
    { 
      title: 'Alertes fraude', 
      value: stats?.fraudAlerts?.toString() || '0', 
      icon: AlertTriangle, 
      color: 'bg-red-500',
      trend: '+8%',
      trendUp: true
    },
    { 
      title: 'Analyses IA', 
      value: stats?.aiAnalysisCount?.toString() || '0', 
      icon: Brain, 
      color: 'bg-purple-500',
      trend: '+24%',
      trendUp: true
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div key={idx} className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className={`${card.color} p-2.5 rounded-xl`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              card.trendUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
            }`}>
              {card.trend}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-sm text-gray-500 mt-1">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

// Bannière IA Transversale avec lien fonctionnel
const IATransversalBanner = () => {
  const router = useRouter();
  
  return (
    <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-4 border border-purple-100">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              IA Transversale Active
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Temps réel</span>
            </h3>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              L'IA analyse en continu le risque financier, la conformité et les opportunités commerciales. 
              Scores mis à jour quotidiennement avec prédictions à 30 jours.
            </p>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">🎯 Précision: 94%</span>
              <span className="flex items-center gap-1">⚡ Dernière analyse: aujourd'hui</span>
              <span className="flex items-center gap-1">📊 Modèle: Gemini 2.0</span>
            </div>
          </div>
        </div>
        
        {/* ✅ LIEN CORRIGÉ - Redirige vers /admin/ia/dashboard */}
        <button
          onClick={() => router.push('/admin/ia/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <LayoutDashboard className="w-4 h-4" />
          Tableau de bord IA
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function CompaniesAdminPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const { fetchCompaniesStats, isLoading } = useCompanies();

  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      setIsLoadingStats(true);
      try {
        const statsData = await fetchCompaniesStats();
        if (statsData) {
          setStats({
            total: statsData.total || 0,
            avgRiskScore: statsData.avgRiskScore || 0,
            fraudAlerts: statsData.fraudAlerts || 0,
            aiAnalysisCount: statsData.aiAnalysisCount || 0,
          });
        } else {
          // Données mockées en attendant l'API
          setStats({
            total: 124,
            avgRiskScore: 35,
            fraudAlerts: 3,
            aiAnalysisCount: 156,
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        // Données de secours
        setStats({
          total: 124,
          avgRiskScore: 35,
          fraudAlerts: 3,
          aiAnalysisCount: 156,
        });
      } finally {
        setIsLoadingStats(false);
      }
    };
    loadStats();
  }, [fetchCompaniesStats]);

  const handleAnalyzeRisk = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setShowRiskModal(true);
  };

  const handleRiskModalClose = () => {
    setShowRiskModal(false);
    setSelectedCompanyId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Entreprises
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestion centralisée avec intelligence artificielle transversale
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle entreprise
        </Button>
      </div>

      {/* Cartes statistiques */}
      <StatsCards stats={stats} isLoading={isLoadingStats} />

      {/* Bannière IA Transversale */}
      <IATransversalBanner />

      {/* Liste des entreprises */}
      <CompanyList 
        onCompanyClick={(id) => router.push(`/admin/companies/${id}`)}
        onAnalyzeRisk={handleAnalyzeRisk}
        showActions={true}
        limit={10}
      />

      {/* Modal formulaire */}
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)}
        title="Nouvelle entreprise"
        size="lg"
      >
        <CompanyForm onClose={() => setShowForm(false)} />
      </Modal>

      {/* Modal analyse de risque IA */}
      <Modal
        isOpen={showRiskModal}
        onClose={handleRiskModalClose}
        title="Analyse de risque IA"
        size="md"
      >
        {selectedCompanyId && (
          <div className="space-y-4">
            <CompanyRiskScore 
              companyId={selectedCompanyId} 
              onRefresh={() => {
                window.location.reload();
              }}
            />
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleRiskModalClose}>
                Fermer
              </Button>
              <Button variant="primary" onClick={() => router.push(`/admin/companies/${selectedCompanyId}/ai-analysis`)}>
                Analyse complète
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}