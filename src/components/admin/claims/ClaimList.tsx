// src/components/admin/claims/ClaimList.tsx
// Liste des sinistres (composant admin) - Version corrigée
// <130 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/shared/DataTable';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useClaims } from '@/hooks/useClaims';
import { usePaginationStore } from '@/stores/paginationStore';
import { useSearchStore } from '@/stores/searchStore';

// Icônes
import { Download, Shield, Eye, AlertTriangle } from 'lucide-react';

interface ClaimListProps {
  onClaimClick?: (id: number) => void;
  onAnalyzeFraud?: (id: number) => void;
  showActions?: boolean;
  limit?: number;
  companyId?: number;
}

export const ClaimList = ({ onClaimClick, onAnalyzeFraud, showActions = true, limit = 10, companyId }: ClaimListProps) => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // ✅ Utiliser les stores pour la pagination et la recherche
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationStore();
  const { searchValue } = useSearchStore();
  const { claims, total, isLoading, fetchClaims } = useClaims({ autoFetch: false });

  // ✅ Effet pour charger les sinistres quand les paramètres changent
  useEffect(() => {
    loadClaims();
  }, [currentPage, pageSize, searchValue, statusFilter, companyId]);

  const loadClaims = async () => {
    await fetchClaims({
      page: currentPage,
      limit: pageSize,
      search: searchValue || undefined,
      status: statusFilter || undefined,
      company_id: companyId
    });
  };

  // ✅ Gestionnaires simplifiés
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handleSearch = (search: string) => {
    // Le store searchStore gère déjà la valeur
    loadClaims();
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1); // Réinitialiser à la page 1
  };

  const columns = [
    { 
      key: 'claim_number', 
      header: 'Numéro', 
      cell: (v: string, r: any) => (
        <div>
          <p className="font-medium">{v}</p>
          <p className="text-xs text-gray-500">{r.type}</p>
        </div>
      ) 
    },
    { key: 'incident_date', header: 'Date incident', cell: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'amount', header: 'Montant', cell: (v: number) => `${v?.toLocaleString()} €` },
    { 
      key: 'fraud_score', 
      header: 'Score fraude', 
      cell: (v: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`rounded-full h-2 ${v >= 70 ? 'bg-red-500' : v >= 40 ? 'bg-orange-500' : 'bg-green-500'}`} 
              style={{ width: `${v || 0}%` }} 
            />
          </div>
          <span className="text-xs">{v || 0}</span>
        </div>
      ) 
    },
    { 
      key: 'status', 
      header: 'Statut', 
      cell: (v: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          v === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
          v === 'APPROVED' ? 'bg-green-100 text-green-700' : 
          'bg-red-100 text-red-700'
        }`}>
          {v === 'PENDING' ? 'En attente' : v === 'APPROVED' ? 'Approuvé' : 'Rejeté'}
        </span>
      ) 
    },
    ...(showActions ? [{
      key: 'actions', 
      header: 'Actions', 
      cell: (_: any, row: any) => (
        <div className="flex gap-2">
          {onAnalyzeFraud && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAnalyzeFraud(row.id); }} 
              className="p-1 text-purple-600 hover:bg-purple-50 rounded" 
              title="Analyser fraude"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/claims/${row.id}`); }} 
            className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
            title="Voir"
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
        <div className="flex justify-between items-center">
          <CardTitle>Sinistres</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtres de statut */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button 
            onClick={() => handleStatusFilter('')} 
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Tous
          </button>
          <button 
            onClick={() => handleStatusFilter('PENDING')} 
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            En attente
          </button>
          <button 
            onClick={() => handleStatusFilter('APPROVED')} 
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'APPROVED' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Approuvés
          </button>
          <button 
            onClick={() => handleStatusFilter('REJECTED')} 
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'REJECTED' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Rejetés
          </button>
        </div>

        {/* ✅ DataTable sans currentPage/pageSize (géré par les stores) */}
        <DataTable 
          columns={columns} 
          data={claims} 
          totalItems={total} 
          isLoading={isLoading} 
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRowClick={(row) => onClaimClick ? onClaimClick(row.id) : router.push(`/admin/claims/${row.id}`)} 
          searchPlaceholder="Rechercher par numéro, type..."
        />
      </CardContent>
    </Card>
  );
};

export default ClaimList;