// src/components/admin/policies/PolicyList.tsx
// Version corrigée avec typage strict du status

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { DataTable } from '@/components/admin/shared/DataTable';
import { usePolicies } from '@/hooks/usePolicies';
import { usePaginationStore } from '@/stores/paginationStore';
import { useSearchStore } from '@/stores/searchStore';
import { POLICY_STATUS, formatCurrency, formatDate } from '@/types/policy.types';

// Icônes
import { Plus, Download, TrendingUp, Eye } from 'lucide-react';

// ✅ Type pour le statut
type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';

interface PolicyListProps {
  onPolicyClick?: (id: number) => void;
  onPredictRenewal?: (id: number) => void;
  showActions?: boolean;
  limit?: number;
  companyId?: number;
}

// Helper pour obtenir le statut valide
const getValidStatus = (status: string | undefined): PolicyStatus => {
  if (status === 'ACTIVE') return 'ACTIVE';
  if (status === 'EXPIRED') return 'EXPIRED';
  if (status === 'CANCELLED') return 'CANCELLED';
  if (status === 'PENDING') return 'PENDING';
  return 'ACTIVE'; // fallback par défaut
};

// Helpers pour le score IA
const getScoreColor = (score: number): string => {
  if (score >= 70) return 'bg-green-100 text-green-700';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const getScoreLabel = (score: number): string => {
  if (score >= 70) return 'Forte';
  if (score >= 40) return 'Modérée';
  return 'Faible';
};

export const PolicyList = ({ 
  onPolicyClick, 
  onPredictRenewal, 
  showActions = true, 
  limit = 10, 
  companyId 
}: PolicyListProps) => {
  const router = useRouter();
  // ✅ Typage correct de statusFilter
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | ''>('');
  
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationStore();
  const { searchValue } = useSearchStore();
  const { policies, total, isLoading, fetchPolicies } = usePolicies({ autoFetch: false });

  useEffect(() => {
    loadPolicies();
  }, [currentPage, pageSize, searchValue, statusFilter, companyId]);

  const loadPolicies = async () => {
    // ✅ Conversion correcte du status
    const statusParam = statusFilter === '' ? undefined : statusFilter;
    
    await fetchPolicies({
      page: currentPage,
      limit: pageSize,
      search: searchValue || undefined,
      status: statusParam,
      company_id: companyId
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  // ✅ Gestionnaire avec typage correct
  const handleStatusFilter = (status: PolicyStatus | '') => {
    setStatusFilter(status);
    setPage(1);
  };

  const getDaysLeft = (endDate: string): number => {
    return Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  };

  const getDaysLeftColor = (daysLeft: number): string => {
    if (daysLeft < 30) return 'text-red-600 font-medium';
    if (daysLeft < 90) return 'text-yellow-600';
    return 'text-green-600';
  };

  const columns = [
    { 
      key: 'policy_number', 
      header: 'Numéro', 
      cell: (v: string, r: any) => (
        <div>
          <p className="font-medium text-gray-900">{v}</p>
          <p className="text-xs text-gray-500">{r.name}</p>
        </div>
      ) 
    },
    { 
      key: 'type', 
      header: 'Type', 
      cell: (v: string) => (
        <span className="text-xs text-gray-600">{v}</span>
      )
    },
    { 
      key: 'premium_amount', 
      header: 'Prime', 
      cell: (v: number) => (
        <span className="text-sm font-medium text-gray-900">{formatCurrency(v)}</span>
      )
    },
    { 
      key: 'end_date', 
      header: 'Échéance', 
      cell: (v: string) => {
        const daysLeft = getDaysLeft(v);
        return (
          <div className="flex flex-col">
            <span className={`text-sm ${getDaysLeftColor(daysLeft)}`}>
              {formatDate(v)}
            </span>
            {daysLeft < 90 && (
              <span className={`text-xs ${getDaysLeftColor(daysLeft)}`}>
                {daysLeft < 30 ? `⚠️ ${daysLeft} jours` : `${daysLeft} jours`}
              </span>
            )}
          </div>
        );
      } 
    },
    { 
      key: 'renewal_score', 
      header: 'Score IA', 
      cell: (v: number) => (
        <div className="flex flex-col gap-1">
          <div className="w-20 bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${v >= 70 ? 'bg-green-500' : v >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${v}%` }}
            />
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${getScoreColor(v)}`}>
            {getScoreLabel(v)} ({v}%)
          </span>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Statut', 
      cell: (v: string | undefined) => {
        const validStatus = getValidStatus(v);
        const statusConfig = POLICY_STATUS[validStatus];
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusConfig?.color || 'bg-gray-100 text-gray-700'}`}>
            {statusConfig?.label || v || 'Inconnu'}
          </span>
        );
      }
    },
    ...(showActions ? [{
      key: 'actions', 
      header: 'Actions', 
      cell: (_: any, row: any) => (
        <div className="flex gap-2">
          {onPredictRenewal && (
            <button 
              onClick={(e) => { e.stopPropagation(); onPredictRenewal(row.id); }} 
              className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors" 
              title="Prédiction IA renouvellement"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/policies/${row.id}`); }} 
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
            title="Voir détails"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    }] : [])
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Contrats</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push('/admin/policies/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtres de statut */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button 
            onClick={() => handleStatusFilter('')} 
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              statusFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button 
            onClick={() => handleStatusFilter('ACTIVE')} 
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              statusFilter === 'ACTIVE' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Actifs
          </button>
          <button 
            onClick={() => handleStatusFilter('EXPIRED')} 
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              statusFilter === 'EXPIRED' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expirés
          </button>
          <button 
            onClick={() => handleStatusFilter('CANCELLED')} 
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              statusFilter === 'CANCELLED' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Résiliés
          </button>
          <button 
            onClick={() => handleStatusFilter('PENDING')} 
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              statusFilter === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En attente
          </button>
        </div>

        <DataTable 
          columns={columns} 
          data={policies} 
          totalItems={total} 
          isLoading={isLoading} 
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRowClick={(row) => onPolicyClick ? onPolicyClick(row.id) : router.push(`/admin/policies/${row.id}`)} 
          searchPlaceholder="Rechercher par numéro, nom de contrat..."
        />
      </CardContent>
    </Card>
  );
};

export default PolicyList;