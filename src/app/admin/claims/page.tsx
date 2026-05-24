// src/app/admin/claims/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, Plus, Search, Filter, Download, 
  Brain, Eye, ChevronLeft, ChevronRight,
  Calendar, Euro
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useClaims } from '@/hooks/useClaims';
import { CLAIM_STATUS, formatCurrency, formatDate, getFraudColor, getFraudLabel } from '@/types/claim.types';

// ✅ Import correct des composants IA
import { IAStatsCards } from '@/components/admin/ia/IAStatsCards';
import { IATransversalBanner } from '@/components/admin/ia/IATransversalBanner';
import { IAInsightsWidget } from '@/components/admin/ia/IAInsightsWidget';
import { IAPredictionsWidget } from '@/components/admin/ia/IAPredictionsWidget';
import { IAFraudAlertWidget } from '@/components/admin/ia/IAFraudAlertWidget';

// Composant Score Fraude local
const FraudScore = ({ score }: { score: number }) => (
  <div className="flex flex-col gap-1">
    <div className="w-20 bg-gray-200 rounded-full h-1.5">
      <div 
        className={`h-1.5 rounded-full ${score >= 80 ? 'bg-red-500' : score >= 60 ? 'bg-orange-500' : score >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
        style={{ width: `${score}%` }} 
      />
    </div>
    <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${getFraudColor(score)}`}>
      {getFraudLabel(score)} ({score}%)
    </span>
  </div>
);

export default function ClaimsPage() {
  const router = useRouter();
  const { claims = [], isLoading, fetchStats } = useClaims({ autoFetch: true });
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadStats = async () => { 
      const data = await fetchStats(); 
      if (data) setStats(data); 
    };
    loadStats();
  }, [fetchStats]);

  const filteredClaims = (claims || []).filter(c => {
    const titleMatch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const numberMatch = c.claim_number?.includes(searchTerm) || false;
    return titleMatch || numberMatch;
  });

  const filteredByStatus = statusFilter ? filteredClaims.filter(c => c.status === statusFilter) : filteredClaims;
  const totalPages = Math.ceil(filteredByStatus.length / itemsPerPage);
  const paginatedClaims = filteredByStatus.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Sinistres
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des sinistres avec détection de fraude IA transversale</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAIAnalysis(!showAIAnalysis)} className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            {showAIAnalysis ? 'Masquer analyse IA' : 'Analyses IA'}
          </Button>
          <Button variant="primary" onClick={() => router.push('/admin/claims/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Déclarer un sinistre
          </Button>
        </div>
      </div>

      {/* Stats IA */}
      <IAStatsCards stats={stats} isLoading={isLoading} />
      
      {/* Bannière IA Transversale */}
      <IATransversalBanner />

      {/* Widgets IA conditionnels */}
      {showAIAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <IAInsightsWidget />
          <IAPredictionsWidget />
          <IAFraudAlertWidget />
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Rechercher par titre ou numéro..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(CLAIM_STATUS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Tableau des sinistres */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Sinistre</th>
                <th className="px-6 py-3">Montant</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Score Fraude</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedClaims.map((claim) => (
                <tr 
                  key={claim.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/claims/${claim.id}`)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{claim.title || 'Sans titre'}</p>
                      <p className="text-xs text-gray-500">{claim.claim_number || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{formatCurrency(claim.estimated_amount || 0)}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(claim.incident_date || new Date().toISOString())}</td>
                  <td className="px-6 py-4"><FraudScore score={claim.fraud_score || 0} /></td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${CLAIM_STATUS[claim.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                      {CLAIM_STATUS[claim.status]?.label || claim.status || 'Inconnu'}
                    </span>
                   </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                   </td>
                 </tr>
              ))}
              {paginatedClaims.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Aucun sinistre trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {filteredByStatus.length} sinistre(s) - Page {currentPage} sur {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg">
                {currentPage}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}