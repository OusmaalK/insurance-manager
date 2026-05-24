// src/app/(broker)/documents/page.tsx
// Documents clients (Courtier)
// <140 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { DataTable } from '@/components/admin/shared/DataTable';
import { useCompanies } from '@/hooks/useCompanies';
import { usePolicies } from '@/hooks/usePolicies';

// Icônes
import { FileText, Download, Upload, AlertTriangle, CheckCircle, Clock, Search } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  type: string;
  clientName: string;
  clientId: number;
  status: 'PRESENT' | 'MISSING' | 'EXPIRING';
  expiryDate?: string;
  uploadedAt?: string;
}

export default function BrokerDocumentsPage() {
  const { companies, isLoading: companiesLoading, fetchCompanies } = useCompanies({ autoFetch: false });
  const { policies, isLoading: policiesLoading, fetchPolicies } = usePolicies({ autoFetch: false });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'missing' | 'expiring'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([fetchCompanies({ limit: 100 }), fetchPolicies({ limit: 100 })]);
    
    // Simuler des documents
    const docs: Document[] = [];
    
    companies.forEach(company => {
      // Document d'identité
      docs.push({
        id: docs.length + 1,
        name: 'Carte d\'identité',
        type: 'IDENTITY',
        clientName: company.name,
        clientId: company.id,
        status: Math.random() > 0.2 ? 'PRESENT' : 'MISSING',
        uploadedAt: new Date().toISOString()
      });
      
      // KBIS
      docs.push({
        id: docs.length + 1,
        name: 'Extrait KBIS',
        type: 'KBIS',
        clientName: company.name,
        clientId: company.id,
        status: Math.random() > 0.3 ? 'PRESENT' : 'MISSING',
        uploadedAt: new Date().toISOString()
      });
      
      // Attestation
      docs.push({
        id: docs.length + 1,
        name: 'Attestation fiscale',
        type: 'TAX',
        clientName: company.name,
        clientId: company.id,
        status: Math.random() > 0.4 ? 'PRESENT' : Math.random() > 0.5 ? 'EXPIRING' : 'MISSING',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedAt: new Date().toISOString()
      });
    });
    
    setDocuments(docs);
    setIsLoading(false);
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'missing') return doc.status === 'MISSING';
    if (filter === 'expiring') return doc.status === 'EXPIRING';
    return true;
  });

  const stats = {
    total: documents.length,
    present: documents.filter(d => d.status === 'PRESENT').length,
    missing: documents.filter(d => d.status === 'MISSING').length,
    expiring: documents.filter(d => d.status === 'EXPIRING').length
  };

  const columns = [
    { key: 'name', header: 'Document', cell: (v: string, r: any) => (<div><p className="font-medium">{v}</p><p className="text-xs text-gray-500">{r.type}</p></div>) },
    { key: 'clientName', header: 'Client' },
    { key: 'status', header: 'Statut', cell: (v: string) => (<span className={`px-2 py-0.5 text-xs rounded-full ${v === 'PRESENT' ? 'bg-green-100 text-green-700' : v === 'MISSING' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{v === 'PRESENT' ? 'Présent' : v === 'MISSING' ? 'Manquant' : 'Expire bientôt'}</span>) },
    { key: 'expiryDate', header: 'Expiration', cell: (v: string) => v ? new Date(v).toLocaleDateString() : '-' },
    { key: 'actions', header: 'Actions', cell: (_: any, row: Document) => (<div className="flex gap-2">{row.status !== 'PRESENT' ? <Button variant="primary" size="xs">Ajouter</Button> : <Button variant="outline" size="xs"><Download className="w-3 h-3 mr-1" />Télécharger</Button>}</div>) }
  ];

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement des documents..." />
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Documents clients</h1><p className="text-gray-500 mt-1">Gérez les documents de vos clients</p></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-3"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Total</p><p className="text-xl font-bold">{stats.total}</p></div><FileText className="w-6 h-6 text-gray-400" /></div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Présents</p><p className="text-xl font-bold text-green-600">{stats.present}</p></div><CheckCircle className="w-6 h-6 text-green-400" /></div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Manquants</p><p className="text-xl font-bold text-red-600">{stats.missing}</p></div><AlertTriangle className="w-6 h-6 text-red-400" /></div></CardContent></Card>
          <Card><CardContent className="p-3"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Expiration</p><p className="text-xl font-bold text-yellow-600">{stats.expiring}</p></div><Clock className="w-6 h-6 text-yellow-400" /></div></CardContent></Card>
        </div>

        <div className="flex gap-2"><button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Tous</button>
        <button onClick={() => setFilter('missing')} className={`px-3 py-1 text-sm rounded-full ${filter === 'missing' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Manquants</button>
        <button onClick={() => setFilter('expiring')} className={`px-3 py-1 text-sm rounded-full ${filter === 'expiring' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Expiration</button></div>

        <Card><CardHeader><CardTitle>Liste des documents</CardTitle></CardHeader><CardContent><DataTable columns={columns} data={filteredDocuments} totalItems={filteredDocuments.length} currentPage={1} pageSize={10} isLoading={false} onPageChange={() => {}} /></CardContent></Card>
      </div>
    </BrokerLayout>
  );
}