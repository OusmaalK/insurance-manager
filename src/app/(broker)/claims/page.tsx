// src/app/(broker)/claims/page.tsx
// Liste des sinistres (courtier) - Version corrigée avec stores
// <150 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { DataTable } from '@/components/admin/shared/DataTable';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useClaims } from '@/hooks/useClaims';
import { usePaginationStore } from '@/stores/paginationStore';
import { useSearchStore } from '@/stores/searchStore';

// Icônes
import { Download, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';

export default function BrokerClaimsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // ✅ Utiliser les stores pour la pagination et la recherche
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationStore();
  const { searchValue } = useSearchStore();
  
  const {
    claims,
    total,
    isLoading,
    fetchClaims,
    iaAlerts,
    fetchIAAlerts
  } = useClaims({ autoFetch: false });

  // ✅ Effet pour charger les sinistres quand les paramètres changent
  useEffect(() => {
    const loadData = async () => {
      await fetchClaims({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        status: statusFilter || undefined
      });
    };
    loadData();
  }, [currentPage, pageSize, searchValue, statusFilter, fetchClaims]);

  useEffect(() => {
    fetchIAAlerts();
  }, [fetchIAAlerts]);

  // ✅ Gestionnaires simplifiés - mettent à jour les stores
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handleSearch = (search: string) => {
    // Le store searchStore est mis à jour via SearchBar
    // On recharge via l'effet
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1); // Réinitialiser à la page 1
  };

  const columns = [
    {
      key: 'claim_number',
      header: 'Numéro',
      cell: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.type}</p>
        </div>
      )
    },
    {
      key: 'incident_date',
      header: 'Date incident',
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'amount',
      header: 'Montant',
      cell: (value: number) => `${value.toLocaleString()} €`
    },
    {
      key: 'fraud_score',
      header: 'Score fraude',
      cell: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`rounded-full h-2 ${
                (value || 0) >= 70 ? 'bg-red-500' :
                (value || 0) >= 40 ? 'bg-orange-500' :
                'bg-green-500'
              }`}
              style={{ width: `${value || 0}%` }}
            />
          </div>
          <span className="text-xs">{value || 0}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          value === 'APPROVED' ? 'bg-green-100 text-green-700' :
          value === 'REJECTED' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {value === 'PENDING' ? 'En attente' :
           value === 'APPROVED' ? 'Approuvé' :
           value === 'REJECTED' ? 'Rejeté' : 'En revue'}
        </span>
      )
    }
  ];

  const stats = {
    total: total,
    pending: claims.filter(c => c.status === 'PENDING').length,
    approved: claims.filter(c => c.status === 'APPROVED').length,
    highFraud: claims.filter(c => (c.fraud_score || 0) >= 70).length,
    totalAmount: claims.reduce((sum, c) => sum + (c.amount || 0), 0)
  };

  const highRiskAlerts = iaAlerts.filter(a => a.risk_level === 'HIGH' || a.risk_level === 'CRITICAL').length;

  return (
    <BrokerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sinistres</h1>
            <p className="text-gray-500 mt-1">Suivez et gérez les sinistres de vos clients</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Alerte IA */}
        {highRiskAlerts > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Alertes IA détectées</p>
                <p className="text-sm text-red-600">{highRiskAlerts} sinistre(s) nécessitent votre attention</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/broker/claims/alerts')}>
              Voir les alertes
            </Button>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-500">Total sinistres</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-500">Approuvés</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-500">Montant total</p>
                <p className="text-2xl font-bold">{stats.totalAmount.toLocaleString()} €</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">indemnités</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres rapides */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleStatusFilter('')}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => handleStatusFilter('PENDING')}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => handleStatusFilter('APPROVED')}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === 'APPROVED' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approuvés
          </button>
          <button
            onClick={() => handleStatusFilter('REJECTED')}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === 'REJECTED' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejetés
          </button>
          <button
            onClick={() => handleStatusFilter('IN_REVIEW')}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === 'IN_REVIEW' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En revue
          </button>
        </div>

        {/* Tableau - ✅ Sans currentPage/pageSize (géré par les stores) */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des sinistres</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={claims}
              totalItems={total}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearch={handleSearch}
              onRowClick={(row) => router.push(`/broker/claims/${row.id}`)}
              searchPlaceholder="Rechercher par numéro, type..."
            />
          </CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
}