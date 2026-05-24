// src/modules/reports/components/ReportGenerator.tsx
// Générateur de rapports
// <130 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { reportsApi } from '@/modules/api/reports/reports.api';
import { ReportGenerationRequest } from '@/types/report.types';

// Icônes
import { FileText, Calendar, Download, Send, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface ReportGeneratorProps {
  onReportGenerated?: (reportId: number) => void;
  defaultType?: string;
}

export const ReportGenerator = ({ onReportGenerated, defaultType = 'PORTFOLIO' }: ReportGeneratorProps) => {
  const [reportType, setReportType] = useState(defaultType);
  const [period, setPeriod] = useState<'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
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

    const request: ReportGenerationRequest = {
      type: reportType,
      period,
      period_start: startDate.toISOString().split('T')[0],
      period_end: endDate.toISOString().split('T')[0],
      format,
    };

    try {
      const response = await reportsApi.generate(request);
      if (response.success && response.data) {
        setSuccess(true);
        if (onReportGenerated) {
          onReportGenerated(response.data.id);
        }
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error || 'Erreur lors de la génération');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Générer un rapport
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Type de rapport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de rapport</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PORTFOLIO">Portefeuille complet</option>
              <option value="CLAIMS">Sinistres</option>
              <option value="POLICIES">Contrats</option>
              <option value="FINANCIAL">Financier</option>
              <option value="IA_ANALYSIS">Analyse IA</option>
            </select>
          </div>

          {/* Période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <div className="flex gap-2">
              {(['WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-sm rounded-lg flex-1 ${
                    period === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p === 'WEEKLY' ? 'Hebdomadaire' : p === 'MONTHLY' ? 'Mensuel' : 'Annuel'}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <div className="flex gap-2">
              {(['pdf', 'excel'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-3 py-1.5 text-sm rounded-lg flex-1 ${
                    format === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Succès */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-600">Rapport généré avec succès !</p>
            </div>
          )}

          {/* Bouton générer */}
          <Button onClick={handleGenerate} disabled={isGenerating} fullWidth>
            {isGenerating ? <LoadingSpinner size="sm" /> : <FileText className="w-4 h-4 mr-2" />}
            {isGenerating ? 'Génération en cours...' : 'Générer le rapport'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;