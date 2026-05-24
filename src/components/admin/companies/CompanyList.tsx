// src/components/admin/companies/CompanyList.tsx
// Liste des entreprises (composant admin) - Version corrigée
// <140 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/shared/DataTable';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useCompanies } from '@/hooks/useCompanies';
import { usePaginationStore } from '@/stores/paginationStore';
import { useSearchStore } from '@/stores/searchStore';

// Icônes
import { Plus, Download, TrendingUp, Eye } from 'lucide-react';

interface CompanyListProps {
  onCompanyClick?: (id: number) => void;
  onAnalyzeRisk?: (id: number) => void;
  showActions?: boolean;
  limit?: number;
}

export const CompanyList = ({ onCompanyClick, onAnalyzeRisk, showActions = true, limit = 10 }: CompanyListProps) => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // ✅ Utiliser les stores pour la pagination et la recherche
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationStore();
  const { searchValue } = useSearchStore();
  const { companies, total, isLoading, fetchCompanies } = useCompanies({ autoFetch: false });

  // ✅ Effet pour charger les entreprises quand les paramètres changent
  useEffect(() => {
    loadCompanies();
  }, [currentPage, pageSize, searchValue, statusFilter]);

  const loadCompanies = async () => {
    await fetchCompanies({
      page: currentPage,
      limit: pageSize,
      search: searchValue || undefined,
      status: statusFilter || undefined
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
    // Le store searchStore gère déjà la valeur via SearchBar
    // On recharge juste les données
    loadCompanies();
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1); // Réinitialiser à la page 1
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Nom', 
      cell: (v: string, r: any) => (
        <div>
          <p className="font-medium">{v}</p>
          <p className="text-xs text-gray-500">{r.siret}</p>
        </div>
      ) 
    },
    { key: 'email', header: 'Email' },
    { key: 'city', header: 'Ville' },
    { 
      key: 'risk_score', 
      header: 'Score risque', 
      cell: (v: number) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          v >= 70 ? 'bg-red-100 text-red-700' : 
          v >= 40 ? 'bg-yellow-100 text-yellow-700' : 
          'bg-green-100 text-green-700'
        }`}>
          {v || 0}
        </span>
      ) 
    },
    { 
      key: 'status', 
      header: 'Statut', 
      cell: (v: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          v === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {v}
        </span>
      ) 
    },
    ...(showActions ? [{
      key: 'actions', 
      header: 'Actions', 
      cell: (_: any, row: any) => (
        <div className="flex gap-2">
          {onAnalyzeRisk && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAnalyzeRisk(row.id); }} 
              className="p-1 text-purple-600 hover:bg-purple-50 rounded" 
              title="Analyser risque"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/companies/${row.id}`); }} 
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
          <CardTitle>Entreprises</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push('/admin/companies/new')}>
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
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Tous
          </button>
          <button 
            onClick={() => handleStatusFilter('ACTIVE')} 
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'ACTIVE' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Actifs
          </button>
          <button 
            onClick={() => handleStatusFilter('INACTIVE')} 
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'INACTIVE' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            Inactifs
          </button>
        </div>

        {/* ✅ DataTable sans currentPage/pageSize (géré par les stores) */}
        <DataTable 
          columns={columns} 
          data={companies} 
          totalItems={total} 
          isLoading={isLoading} 
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRowClick={(row) => onCompanyClick ? onCompanyClick(row.id) : router.push(`/admin/companies/${row.id}`)} 
          searchPlaceholder="Rechercher par nom, email, SIRET..."
        />
      </CardContent>
    </Card>
  );
};

export default CompanyList;