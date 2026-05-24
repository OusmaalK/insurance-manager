// src/app/(broker)/clients/page.tsx
// Liste des clients (courtier) - Version corrigée avec stores
// <150 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { DataTable } from '@/components/admin/shared/DataTable';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useCompanies } from '@/hooks/useCompanies';
import { usePaginationStore } from '@/stores/paginationStore';
import { useSearchStore } from '@/stores/searchStore';

// Icônes
import { UserPlus, Download } from 'lucide-react';

export default function BrokerClientsPage() {
  const router = useRouter();
  
  // ✅ Utiliser les stores pour la pagination et la recherche
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationStore();
  const { searchValue } = useSearchStore();
  
  const {
    companies,
    total,
    isLoading,
    fetchCompanies,
  } = useCompanies({ autoFetch: false });

  // ✅ Effet pour charger les clients quand les paramètres changent
  useEffect(() => {
    const loadData = async () => {
      await fetchCompanies({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
      });
    };
    loadData();
  }, [currentPage, pageSize, searchValue, fetchCompanies]);

  // ✅ Gestionnaires simplifiés - mettent à jour les stores
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handleSearch = (search: string) => {
    // Le store searchStore est mis à jour via SearchBar
    // La recherche sera déclenchée par l'effet
  };

  const columns = [
    {
      key: 'name',
      header: 'Nom',
      cell: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.siret}</p>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Téléphone',
    },
    {
      key: 'city',
      header: 'Ville',
    },
    {
      key: 'risk_score',
      header: 'Score risque',
      cell: (value: number) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value >= 70 ? 'bg-red-100 text-red-700' :
          value >= 40 ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {value === 'ACTIVE' ? 'Actif' : 'Inactif'}
        </span>
      )
    }
  ];

  // Calcul des statistiques
  const avgRiskScore = companies.length > 0
    ? Math.round(companies.reduce((sum, c) => sum + (c.risk_score || 0), 0) / companies.length)
    : 0;
  
  const activeCount = companies.filter(c => c.status === 'ACTIVE').length;

  return (
    <BrokerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes clients</h1>
            <p className="text-gray-500 mt-1">
              Gérez votre portefeuille clients
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push('/broker/clients/new')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Nouveau client
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total clients</p>
              <p className="text-2xl font-bold">{total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Score moyen</p>
              <p className="text-2xl font-bold">{avgRiskScore}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Clients actifs</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des clients - ✅ Sans currentPage/pageSize (géré par les stores) */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des clients</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={companies}
              totalItems={total}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearch={handleSearch}
              onRowClick={(row) => router.push(`/broker/clients/${row.id}`)}
              searchPlaceholder="Rechercher par nom, email, SIRET..."
            />
          </CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
}