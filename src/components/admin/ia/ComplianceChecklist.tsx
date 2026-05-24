// src/components/admin/ia/ComplianceChecklist.tsx
'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Shield, FileText, Users, Database, Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface ComplianceItem {
  id: number;
  title: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  category: string;
  icon: any;
}

export const ComplianceChecklist = () => {
  const [items] = useState<ComplianceItem[]>([
    { id: 1, title: 'RGPD - Protection des données', description: 'Vérification de la conformité RGPD', status: 'compliant', category: 'Data', icon: Shield },
    { id: 2, title: 'Déclaration sinistres', description: 'Délais de traitement conformes', status: 'compliant', category: 'Claims', icon: FileText },
    { id: 3, title: 'Certification courtier', description: 'Formation continue à jour', status: 'pending', category: 'Broker', icon: Users },
    { id: 4, title: 'Archivage documents', description: 'Durée de conservation légale', status: 'non-compliant', category: 'Data', icon: Database },
    { id: 5, title: 'Information client', description: 'Documentation précontractuelle', status: 'pending', category: 'Client', icon: Bell },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'non-compliant': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant': return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Conforme</span>;
      case 'non-compliant': return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">Non conforme</span>;
      default: return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">En attente</span>;
    }
  };

  const stats = {
    compliant: items.filter(i => i.status === 'compliant').length,
    nonCompliant: items.filter(i => i.status === 'non-compliant').length,
    pending: items.filter(i => i.status === 'pending').length,
    total: items.length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Conformité réglementaire
          </CardTitle>
          <button className="text-sm text-blue-600 hover:text-blue-700">Rapport complet →</button>
        </div>
        <p className="text-xs text-gray-500">Contrôle de conformité IA</p>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">{stats.compliant}</p>
            <p className="text-xs text-gray-500">Conformes</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-500">En attente</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <p className="text-lg font-bold text-red-600">{stats.nonCompliant}</p>
            <p className="text-xs text-gray-500">Non conformes</p>
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-all">
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
              {getStatusBadge(item.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};