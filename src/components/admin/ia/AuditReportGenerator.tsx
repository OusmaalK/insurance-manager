// src/components/admin/ia/AuditReportGenerator.tsx
'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, Clock, Filter, Eye, RefreshCw, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface AuditLog {
  id: number;
  action: string;
  user: string;
  module: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

interface ReportConfig {
  type: 'claims' | 'policies' | 'companies' | 'users' | 'ia';
  format: 'pdf' | 'csv' | 'excel';
  dateRange: 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
}

export const AuditReportGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportConfig['type']>('ia');
  const [dateRange, setDateRange] = useState<ReportConfig['dateRange']>('month');
  const [format, setFormat] = useState<ReportConfig['format']>('pdf');
  const [logs, setLogs] = useState<AuditLog[]>([
    { id: 1, action: 'Analyse risque entreprise', user: 'admin@courtier.fr', module: 'Entreprises', timestamp: '2026-05-24 10:30:00', status: 'success', details: 'Score risque calculé: 35%' },
    { id: 2, action: 'Prédiction renouvellement', user: 'admin@courtier.fr', module: 'Contrats', timestamp: '2026-05-24 09:15:00', status: 'success', details: 'Probabilité: 85%' },
    { id: 3, action: 'Détection fraude', user: 'system', module: 'IA', timestamp: '2026-05-24 08:00:00', status: 'warning', details: 'Score fraude élevé: 78%' },
    { id: 4, action: 'Appel API Gemini', user: 'system', module: 'IA', timestamp: '2026-05-24 07:30:00', status: 'success', details: 'Latence: 1.2s, Coût: 0.002€' },
    { id: 5, action: 'Génération rapport', user: 'broker@courtier.fr', module: 'Rapports', timestamp: '2026-05-24 07:00:00', status: 'error', details: 'Erreur de génération' },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Succès</span>;
      case 'warning': return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">Attention</span>;
      case 'error': return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">Erreur</span>;
      default: return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">Info</span>;
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simuler génération
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    alert(`Rapport ${selectedReport} généré en format ${format}`);
  };

  // Fonction corrigée pour obtenir la description CRON
  const getCronDescription = (cron: string): string => {
    const parts = cron.split(' ');
    if (parts.length < 5) return 'Non défini';
    
    const minute = parts[0];
    const hour = parts[1];
    const dayOfMonth = parts[2];
    const month = parts[3];
    const dayOfWeek = parts[4];
    
    // Correction: Vérification des valeurs littérales
    if (minute === '0' && hour === '6' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Quotidien à 06:00';
    }
    if (minute === '0' && hour === '8' && dayOfMonth === '*' && month === '*' && dayOfWeek === '1') {
      return 'Hebdomadaire (lundi) à 08:00';
    }
    if (minute === '0' && hour === '0' && dayOfMonth === '1' && month === '*' && dayOfWeek === '*') {
      return 'Mensuel (1er du mois)';
    }
    if (minute === '0' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Horaire (à chaque heure pleine)';
    }
    if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Toutes les minutes';
    }
    if (minute !== '0') {
      return `À ${minute} minute${parseInt(minute) > 1 ? 's' : ''} après chaque heure`;
    }
    if (hour !== '*') {
      return `Quotidien à ${hour}h${minute !== '0' ? minute : '00'}`;
    }
    
    return `Cron: ${cron}`;
  };

  const reportTypes = [
    { value: 'claims', label: 'Rapport sinistres', icon: AlertCircle },
    { value: 'policies', label: 'Rapport contrats', icon: FileText },
    { value: 'companies', label: 'Rapport entreprises', icon: FileText },
    { value: 'users', label: 'Rapport utilisateurs', icon: FileText },
    { value: 'ia', label: 'Rapport IA', icon: FileText },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Générateur de rapports d'audit
          </CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualiser
          </Button>
        </div>
        <p className="text-xs text-gray-500">Génération et consultation des rapports d'audit IA</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration rapport */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Configuration du rapport</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type de rapport */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type de rapport</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value as ReportConfig['type'])}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Période */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Période</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as ReportConfig['dateRange'])}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="custom">Personnalisé</option>
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ReportConfig['format'])}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full mt-4"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Générer le rapport
              </>
            )}
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">156</p>
            <p className="text-xs text-gray-500">Appels IA réussis</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <p className="text-lg font-bold text-yellow-600">12</p>
            <p className="text-xs text-gray-500">Alertes</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <p className="text-lg font-bold text-red-600">3</p>
            <p className="text-xs text-gray-500">Erreurs</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">2.45€</p>
            <p className="text-xs text-gray-500">Coût IA</p>
          </div>
        </div>

        {/* Liste des logs d'audit */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Journal d'audit IA
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(log.status)}
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-gray-500">
                      {log.module} • {log.user} • {log.timestamp}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{log.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(log.status)}
                  <button className="p-1 hover:bg-white rounded">
                    <Eye className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs programmés */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            Rapports programmés
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Rapport hebdomadaire IA</p>
                <p className="text-xs text-gray-500">Tous les lundis à 08:00</p>
              </div>
              <Button variant="ghost" size="sm">
                Modifier <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Rapport mensuel sinistres</p>
                <p className="text-xs text-gray-500">1er du mois à 06:00</p>
              </div>
              <Button variant="ghost" size="sm">
                Modifier <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditReportGenerator;