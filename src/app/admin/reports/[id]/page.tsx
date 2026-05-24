// src/app/admin/reports/[id]/page.tsx
// Page détail d'un rapport
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, FileText, Download, Trash2, RefreshCw,
  Brain, Calendar, Clock, User, BarChart3, PieChart,
  TrendingUp, AlertTriangle, CheckCircle, Sparkles,
  Share2, Mail, Printer, Eye
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useReports } from '@/hooks/useReports';
import { useAIReports } from '@/hooks/useAIReports';
import { 
  getReportTypeLabel, getReportTypeColor,
  getReportStatusLabel, getReportStatusColor,
  formatDateTime, formatFileSize
} from '@/types/report.types';

// Métriques IA pour le rapport
const ReportMetrics = ({ data }: { data: any }) => {
  const metrics = [
    { label: 'Score de confiance', value: data?.confidence || 94, unit: '%', color: 'text-green-600' },
    { label: 'Temps de génération', value: data?.generationTime || 2.5, unit: 's', color: 'text-blue-600' },
    { label: 'Volume données', value: data?.dataVolume || 1247, unit: 'lignes', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, idx) => (
        <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold">{metric.value}{metric.unit}</p>
          <p className="text-xs text-gray-500">{metric.label}</p>
        </div>
      ))}
    </div>
  );
};

// Prévisualisation du rapport
const ReportPreview = ({ report }: { report: any }) => {
  if (!report?.data) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Aucune donnée à prévisualiser</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Résumé</h3>
      <div className="p-4 bg-gray-50 rounded-lg">
        <pre className="text-sm whitespace-pre-wrap font-sans">
          {JSON.stringify(report.data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = parseInt(params.id as string);
  const { getReport, exportReport, deleteReport, isLoading } = useReports();
  const { getAIReport } = useAIReports();
  
  const [report, setReport] = useState<any>(null);
  const [aiReport, setAiReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getReport(reportId);
      setReport(data);
      
      if (data?.type === 'AI') {
        const ai = await getAIReport(reportId);
        setAiReport(ai);
      }
    };
    load();
  }, [reportId]);

  const handleExport = async (format: 'PDF' | 'EXCEL' | 'CSV') => {
    setIsExporting(true);
    await exportReport(reportId, format);
    setIsExporting(false);
  };

  const handleDelete = async () => {
    if (confirm('Confirmer la suppression de ce rapport ?')) {
      await deleteReport(reportId);
      router.push('/admin/reports');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement..." />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-gray-600">Rapport non trouvé</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push('/admin/reports')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/reports" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
            <p className="text-sm text-gray-500">Généré le {formatDateTime(report.generatedAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('EXCEL')} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('CSV')} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Informations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FileText className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p className="font-medium">{getReportTypeLabel(report.type)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Date génération</p>
            <p className="font-medium">{formatDateTime(report.generatedAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500">Créé par</p>
            <p className="font-medium">{report.createdByName || 'Administrateur'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-xs text-gray-500">Statut</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getReportStatusColor(report.status)}`}>
              {getReportStatusLabel(report.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Métriques IA (si rapport IA) */}
      {report.type === 'AI' && aiReport && (
        <ReportMetrics data={aiReport.metrics} />
      )}

      {/* Tabs */}
      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          {report.type === 'AI' && (
            <>
              <TabsTrigger value="insights">📊 Insights</TabsTrigger>
              <TabsTrigger value="recommendations">🎯 Recommandations</TabsTrigger>
            </>
          )}
          <TabsTrigger value="metadata">ℹ️ Métadonnées</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardContent className="p-6">
              <ReportPreview report={report} />
            </CardContent>
          </Card>
        </TabsContent>

        {report.type === 'AI' && aiReport && (
          <>
            <TabsContent value="insights">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Insights IA</h3>
                  <div className="space-y-3">
                    {aiReport.insights?.map((insight: any, idx: number) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium">{insight.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        <p className="text-xs text-blue-600 mt-2">Impact: {insight.impact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Recommandations IA</h3>
                  <div className="space-y-3">
                    {aiReport.recommendations?.map((rec: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                        rec.priority === 'HIGH' ? 'border-red-500 bg-red-50' :
                        rec.priority === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
                        'border-green-500 bg-green-50'
                      }`}>
                        <p className="font-medium">{rec.action}</p>
                        <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                        <p className="text-xs mt-2">Impact attendu: {rec.expectedImpact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}

        <TabsContent value="metadata">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Métadonnées</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">ID</span>
                  <span className="font-mono">{report.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Taille</span>
                  <span>{formatFileSize(report.metadata?.size || 0)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Source</span>
                  <span>{report.metadata?.source || 'API'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Période</span>
                  <span>
                    {report.metadata?.dateRange?.start} → {report.metadata?.dateRange?.end}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline">
          <Mail className="w-4 h-4 mr-2" />
          Envoyer par email
        </Button>
        <Button variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Imprimer
        </Button>
        <Button variant="primary">
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </div>
    </div>
  );
}