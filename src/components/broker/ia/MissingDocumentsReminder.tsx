// src/components/broker/ia/MissingDocumentsReminder.tsx
// Rappel documents manquants IA (Courtier)
// <110 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useCompanies } from '@/hooks/useCompanies';

// Icônes
import { FileText, AlertTriangle, CheckCircle, Upload, Clock, Download, Mail } from 'lucide-react';

interface MissingDocument {
  id: number;
  clientId: number;
  clientName: string;
  documentType: string;
  requiredBy: string;
  status: 'MISSING' | 'EXPIRING' | 'PRESENT';
}

export const MissingDocumentsReminder = () => {
  const { companies, isLoading: companiesLoading, fetchCompanies } = useCompanies({ autoFetch: false });
  const [documents, setDocuments] = useState<MissingDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await fetchCompanies({ limit: 100 });
    
    // Simuler des documents manquants
    const docs: MissingDocument[] = [];
    companies.forEach(company => {
      if (Math.random() > 0.7) {
        docs.push({
          id: docs.length + 1,
          clientId: company.id,
          clientName: company.name,
          documentType: 'KBIS',
          requiredBy: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'MISSING',
        });
      }
      if (Math.random() > 0.8) {
        docs.push({
          id: docs.length + 1,
          clientId: company.id,
          clientName: company.name,
          documentType: 'Attestation fiscale',
          requiredBy: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'EXPIRING',
        });
      }
    });
    
    setDocuments(docs);
    setIsLoading(false);
  };

  const handleSendReminder = (clientId: number, documentType: string) => {
    alert(`Rappel envoyé à ${clientId} pour document ${documentType}`);
  };

  if (isLoading || companiesLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <LoadingSpinner size="md" text="Chargement des documents..." />
        </CardContent>
      </Card>
    );
  }

  const missingCount = documents.filter(d => d.status === 'MISSING').length;
  const expiringCount = documents.filter(d => d.status === 'EXPIRING').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          Documents manquants
          {(missingCount + expiringCount) > 0 && (
            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
              {missingCount + expiringCount}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2 bg-red-50 rounded-lg text-center">
            <p className="text-xs text-gray-500">Manquants</p>
            <p className="text-xl font-bold text-red-600">{missingCount}</p>
          </div>
          <div className="p-2 bg-yellow-50 rounded-lg text-center">
            <p className="text-xs text-gray-500">Expiration</p>
            <p className="text-xl font-bold text-yellow-600">{expiringCount}</p>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Tous les documents sont à jour</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.slice(0, 5).map((doc) => (
              <div key={doc.id} className={`p-3 rounded-lg border ${doc.status === 'MISSING' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{doc.clientName}</p>
                    <p className="text-xs text-gray-600 mt-1">Document: {doc.documentType}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {doc.status === 'MISSING' ? 'À fournir' : `Expire le ${new Date(doc.requiredBy).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleSendReminder(doc.clientId, doc.documentType)}>
                    <Mail className="w-3 h-3 mr-1" />
                    Relancer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissingDocumentsReminder;