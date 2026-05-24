// src/app/(broker)/reports/page.tsx
// Rapports IA pour courtier
// <140 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useReports } from '@/hooks/useReports';

// Icônes
import { FileText, Download, Send, Calendar, TrendingUp, FileBarChart, Eye } from 'lucide-react';

export default function BrokerReportsPage() {
  const {
    reports,
    total,
    isLoading,
    fetchReports,
    generateReport,
    exportReport,
    sendReport,
    subscriptions,
    fetchSubscriptions
  } = useReports({ autoFetch: true });

  const [generating, setGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'WEEKLY' | 'MONTHLY' | 'YEARLY'>('WEEKLY');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleGenerateReport = async () => {
    setGenerating(true);
    const startDate = new Date();
    const endDate = new Date();
    
    switch (selectedPeriod) {
      case 'WEEKLY':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'MONTHLY':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'YEARLY':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
    
    await generateReport({
      type: 'PORTFOLIO',
      period: selectedPeriod,
      period_start: startDate.toISOString().split('T')[0],
      period_end: endDate.toISOString().split('T')[0],
      format: selectedFormat
    });
    
    setGenerating(false);
  };

  const handleExport = async (id: number, format: 'pdf' | 'excel') => {
    const blob = await exportReport(id, format);
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${id}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700'
    };
    return styles[status as keyof typeof styles] || styles.completed;
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement des rapports..." />
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports IA</h1>
            <p className="text-gray-500 mt-1">Générez et gérez vos rapports intelligents</p>
          </div>
        </div>

        {/* Génération de rapport */}
        <Card>
          <CardHeader>
            <CardTitle>Générer un nouveau rapport</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                <div className="flex gap-2">
                  {(['WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1.5 text-sm rounded-lg ${
                        selectedPeriod === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {period === 'WEEKLY' ? 'Hebdomadaire' : period === 'MONTHLY' ? 'Mensuel' : 'Annuel'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <div className="flex gap-2">
                  {(['pdf', 'excel'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`px-3 py-1.5 text-sm rounded-lg ${
                        selectedFormat === format
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleGenerateReport} disabled={generating}>
                {generating ? <LoadingSpinner size="sm" /> : <FileBarChart className="w-4 h-4 mr-2" />}
                {generating ? 'Génération...' : 'Générer le rapport'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rapports */}
        <Card>
          <CardHeader>
            <CardTitle>Mes rapports</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucun rapport généré</p>
                <p className="text-sm">Utilisez le formulaire ci-dessus pour créer votre premier rapport</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Rapport {report.type} - {report.period}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(report.generated_at).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(report.id, 'pdf')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(report.id, 'excel')}
                      >
                        <FileBarChart className="w-4 h-4 mr-1" />
                        Excel
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Abonnements */}
        {subscriptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Abonnements aux rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-2">
                    <div>
                      <p className="text-sm">
                        Rapport {sub.report_type} - {sub.frequency}
                      </p>
                      <p className="text-xs text-gray-500">Envoyé à: {sub.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${sub.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {sub.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BrokerLayout>
  );
}