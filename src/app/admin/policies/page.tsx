// src/app/admin/policies/page.tsx
// Page liste des contrats avec IA
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, Plus, Search, Filter, Download, 
  Brain, TrendingUp, Shield, AlertTriangle,
  Eye, Edit, Trash2, ChevronLeft, ChevronRight,
  Building2, Calendar, Euro, Sparkles
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';

// Types simplifiés pour éviter les erreurs d'import
type Policy = {
  id: number;
  name: string;
  policy_number: string;
  type: string;
  premium_amount: number;
  end_date: string;
  renewal_score: number;
  status: string;
};

// Données mockées pour le test
const mockPolicies: Policy[] = [
  { id: 1, name: 'Assurance Auto Pro', policy_number: 'POL-001', type: 'AUTO', premium_amount: 1200, end_date: '2026-12-31', renewal_score: 85, status: 'ACTIVE' },
  { id: 2, name: 'Assurance Habitation', policy_number: 'POL-002', type: 'HOME', premium_amount: 450, end_date: '2026-10-15', renewal_score: 72, status: 'ACTIVE' },
  { id: 3, name: 'Responsabilité Civile', policy_number: 'POL-003', type: 'LIABILITY', premium_amount: 890, end_date: '2026-08-01', renewal_score: 45, status: 'ACTIVE' },
];

// Fonctions utilitaires simplifiées
const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

const getRenewalScoreColor = (score: number) => {
  if (score >= 70) return 'bg-green-100 text-green-700';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const getRenewalScoreLabel = (score: number) => {
  if (score >= 70) return 'Forte probabilité';
  if (score >= 40) return 'Probabilité modérée';
  return 'Faible probabilité';
};

const POLICY_TYPES: Record<string, { label: string; color: string }> = {
  AUTO: { label: 'Assurance Auto', color: 'bg-blue-100 text-blue-700' },
  HOME: { label: 'Assurance Habitation', color: 'bg-green-100 text-green-700' },
  HEALTH: { label: 'Assurance Santé', color: 'bg-purple-100 text-purple-700' },
  LIABILITY: { label: 'Responsabilité Civile', color: 'bg-amber-100 text-amber-700' },
};

const POLICY_STATUS: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  EXPIRED: { label: 'Expiré', color: 'bg-gray-100 text-gray-700' },
  CANCELLED: { label: 'Résilié', color: 'bg-red-100 text-red-700' },
};

// Statistiques IA
const StatsCards = ({ stats, isLoading }: { stats: any; isLoading: boolean }) => {
  const cards = [
    { title: 'Contrats actifs', value: stats?.activeCount || 3, icon: FileText, color: 'bg-blue-500', trend: '+8%' },
    { title: 'Prime totale', value: formatCurrency(stats?.totalPremium || 2540), icon: Euro, color: 'bg-green-500', trend: '+12%' },
    { title: 'Échéances 30j', value: stats?.expiringCount || 1, icon: Calendar, color: 'bg-amber-500', trend: '-5%' },
    { title: 'Score renouvellement', value: `${stats?.avgRenewalScore || 67}%`, icon: TrendingUp, color: 'bg-purple-500', trend: '+3%' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl border p-5 animate-pulse"><div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div><div className="h-8 bg-gray-200 rounded w-3/4"></div></div>)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div key={idx} className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className={`${card.color} p-2.5 rounded-xl`}><card.icon className="w-5 h-5 text-white" /></div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{card.trend}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-sm text-gray-500 mt-1">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

// Bannière IA
const IABanner = () => (
  <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-4 border border-purple-100">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg"><Brain className="w-5 h-5 text-white" /></div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">IA Transversale Active <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Prédictions renouvellement</span></h3>
        <p className="text-sm text-gray-600 mt-1">L'IA analyse chaque contrat et prédit la probabilité de renouvellement, détecte les clauses risquées et suggère des optimisations de prime.</p>
        <div className="flex gap-4 mt-2 text-xs text-gray-500"><span>🎯 Précision: 92%</span><span>⚡ Analyse en temps réel</span><span>📊 Modèle: Gemini 2.0</span></div>
      </div>
      <Link href="/admin/ia/dashboard">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
          Tableau de bord IA
        </button>
      </Link>
    </div>
  </div>
);

export default function PoliciesPage() {
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simuler le chargement des stats
    setStats({
      activeCount: 3,
      totalPremium: 2540,
      expiringCount: 1,
      avgRenewalScore: 67,
    });
  }, []);

  const filteredPolicies = policies.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.policy_number.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Contrats
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des contrats avec analyse IA et prédictions de renouvellement</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/admin/policies/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau contrat
        </Button>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} isLoading={isLoading} />
      
      {/* Bannière IA */}
      <IABanner />

      {/* Barre de recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou numéro de contrat..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5 text-gray-500" />
        </button>
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Tableau des contrats */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Contrat</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Prime</th>
                <th className="px-6 py-3">Échéance</th>
                <th className="px-6 py-3">Score IA</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPolicies.map((policy) => (
                <tr 
                  key={policy.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/policies/${policy.id}`)}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{policy.name}</p>
                    <p className="text-xs text-gray-500">{policy.policy_number}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${POLICY_TYPES[policy.type]?.color || 'bg-gray-100 text-gray-700'}`}>
                      {POLICY_TYPES[policy.type]?.label || policy.type}
                    </span>
                   </td>
                  <td className="px-6 py-4 text-sm font-medium">{formatCurrency(policy.premium_amount)}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(policy.end_date)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRenewalScoreColor(policy.renewal_score)}`}>
                      {getRenewalScoreLabel(policy.renewal_score)} ({policy.renewal_score}%)
                    </span>
                   </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${POLICY_STATUS[policy.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                      {POLICY_STATUS[policy.status]?.label || policy.status}
                    </span>
                   </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
              {filteredPolicies.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Aucun contrat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm text-gray-500">{filteredPolicies.length} contrat(s)</span>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}