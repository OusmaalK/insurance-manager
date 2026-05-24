// src/components/broker/clients/ClientList.tsx
// Liste des clients (Courtier)
// <120 lignes

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
import { UserPlus, Download } from 'lucide-react';

interface ClientListProps {
  onClientClick?: (id: number) => void;
  limit?: number;
}

export const ClientList = ({ onClientClick, limit = 10 }: ClientListProps) => {
  const router = useRouter();
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationStore();
  const { searchValue } = useSearchStore();
  const { companies, total, isLoading, fetchCompanies } = useCompanies({ autoFetch: false });

  useEffect(() => {
    fetchCompanies({ page: currentPage, limit: pageSize, search: searchValue || undefined });
  }, [currentPage, pageSize, searchValue]);

  const handlePageChange = (page: number) => setPage(page);
  const handlePageSizeChange = (size: number) => setPageSize(size);
  const handleSearch = () => {};

  const columns = [
    { key: 'name', header: 'Nom', cell: (v: string, r: any) => (<div><p className="font-medium">{v}</p><p className="text-xs text-gray-500">{r.siret}</p></div>) },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Téléphone' },
    { key: 'city', header: 'Ville' },
    { key: 'risk_score', header: 'Score risque', cell: (v: number) => (<span className={`px-2 py-1 text-xs rounded-full ${v >= 70 ? 'bg-red-100 text-red-700' : v >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{v}</span>) },
    { key: 'status', header: 'Statut', cell: (v: string) => (<span className={`px-2 py-1 text-xs rounded-full ${v === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{v === 'ACTIVE' ? 'Actif' : 'Inactif'}</span>) }
  ];

  const avgRiskScore = companies.length > 0 ? Math.round(companies.reduce((sum, c) => sum + (c.risk_score || 0), 0) / companies.length) : 0;
  const activeCount = companies.filter(c => c.status === 'ACTIVE').length;

  return (
    <Card>
      <CardHeader><div className="flex justify-between items-center"><CardTitle>Mes clients</CardTitle><div className="flex gap-2"><Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Exporter</Button><Button variant="primary" size="sm" onClick={() => router.push('/broker/clients/new')}><UserPlus className="w-4 h-4 mr-2" />Ajouter</Button></div></div></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Total clients</p><p className="text-2xl font-bold">{total}</p></div>
          <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Score moyen</p><p className="text-2xl font-bold">{avgRiskScore}</p></div>
          <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Clients actifs</p><p className="text-2xl font-bold">{activeCount}</p></div>
        </div>
        <DataTable columns={columns} data={companies} totalItems={total} isLoading={isLoading} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} onSearch={handleSearch} onRowClick={(row) => onClientClick ? onClientClick(row.id) : router.push(`/broker/clients/${row.id}`)} searchPlaceholder="Rechercher..." />
      </CardContent>
    </Card>
  );
};

export default ClientList;