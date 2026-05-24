// src/app/admin/reports/page.tsx
// Page liste des rapports avec IA transversale
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Plus, Search, Filter, Download, 
  Brain, Eye, Trash2, ChevronLeft, ChevronRight,
  BarChart3, Sparkles, Clock, CheckCircle, AlertCircle,
  Calendar, TrendingUp, Award, Zap, Target
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { useReports } from '@/hooks/useReports';
import { useAIReports } from '@/hooks/useAIReports';
import { ReportDashboard } from '@/components/admin/reports/ReportDashboard';
import { 
  REPORT_TYPES, REPORT_STATUS, REPORT_FORMATS,
  getReportTypeLabel, getReportTypeColor,
  getReportStatusLabel, getReportStatusColor,
  formatDateTime, formatFileSize
} from '@/types/report.types';

// ============================================
// BANNIÈRE IA TRANSVERSALE
// ============================================
const IATransversalBanner = () => {
  const router = useRouter();
  
  return (
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold">IA Transversale - Rapports Intelligents</h3>
              <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded-full">Génération automatique</span>
              <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full">Gemini 2.0</span>
            </div>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              L'IA génère des rapports intelligents avec analyses prédictives, recommandations et insights.
              Rapports planifiables et exportables en plusieurs formats.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-purple-200">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Génération instantanée</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Précision 94%</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> 124 rapports générés</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/reports/ia')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm font-medium"
          >
            <Brain className="w-4 h-4" />
            Rapports IA
          </button>
          <button 
            onClick={() => router.push('/admin/reports/new')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nouveau rapport
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STATISTIQUES
// ============================================
const StatsCards = ({ stats, isLoading }: { stats: any; isLoading: boolean }) => {
  const cards = [
    { title: 'Rapports générés', value: stats?.total || 0, icon: FileText, color: 'bg-blue-500', trend: '+15%' },
    { title: 'Rapports IA', value: stats?.aiCount || 0, icon: Brain, color: 'bg-purple-500', trend: '+32%' },
    { title: 'Planifiés', value: stats?.scheduledCount || 0, icon: Calendar, color: 'bg-green-500', trend: '+8%' },
    { title: 'Exportés', value: stats?.recentGenerations || 0, icon: Download, color: 'bg-amber-500', trend: '+22%' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="animate-pulse h-28 bg-gray-100 rounded-xl"></div>)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className={`${card.color} p-2.5 rounded-xl`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{card.trend}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-sm text-gray-500 mt-1">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

// ============================================
// COMPOSANT RECOMMANDATIONS IA
// ============================================
const IARecommendationsWidget = () => {
  const recommendations = [
    { title: 'Générer un rapport mensuel', description: 'Analyse des tendances du mois dernier', priority: 'high', action: 'Générer' },
    { title: 'Exporter les sinistres en PDF', description: 'Format recommandé pour l\'archivage', priority: 'medium', action: 'Exporter' },
    { title: 'Planifier rapport hebdomadaire', description: 'Automatisez vos envois', priority: 'low', action: 'Planifier' },
  ];

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      default: return 'border-l-4 border-green-500 bg-green-50';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-900">Recommandations IA</h3>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec, idx) => (
            <div key={idx} className={`p-2 rounded-lg ${getPriorityStyles(rec.priority)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{rec.title}</p>
                  <p className="text-xs text-gray-600">{rec.description}</p>
                </div>
                <button className="text-xs text-purple-600 hover:text-purple-700">{rec.action} →</button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// PAGE PRINCIPALE
// ============================================
export default function ReportsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'dashboard'>('list');
  const { reports, total, isLoading, fetchStats } = useReports({ autoFetch: true });
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [showAIPanel, setShowAIPanel] = useState(true);

  useEffect(() => {
    const loadStats = async () => { const data = await fetchStats(); if (data) setStats(data); };
    loadStats();
  }, [fetchStats]);

  const filteredReports = (reports || []).filter(r => {
    const titleMatch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = !typeFilter || r.type === typeFilter;
    return titleMatch && typeMatch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Rapports
          </h1>
          <p className="text-sm text-gray-500 mt-1">Génération et gestion des rapports avec IA</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3 py-1 rounded-md text-sm transition-all ${viewMode === 'dashboard' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              Dashboard
            </button>
          </div>
          <Button variant="outline" onClick={() => setShowAIPanel(!showAIPanel)} className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            {showAIPanel ? 'Masquer IA' : 'Activer IA'}
          </Button>
          <Button variant="primary" onClick={() => router.push('/admin/reports/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau rapport
          </Button>
        </div>
      </div>

      {/* Vue Dashboard */}
      {viewMode === 'dashboard' ? (
        <ReportDashboard />
      ) : (
        <>
          {/* Bannière IA */}
          <IATransversalBanner />

          {/* Stats */}
          <StatsCards stats={stats} isLoading={isLoading} />

          {/* Panneau IA */}
          {showAIPanel && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IARecommendationsWidget />
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-gray-900">Métriques IA</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-700">{stats?.aiCount || 0}</p>
                      <p className="text-xs text-gray-500">Rapports IA</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-700">{stats?.scheduledCount || 0}</p>
                      <p className="text-xs text-gray-500">Planifiés</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-700">94%</p>
                      <p className="text-xs text-gray-500">Précision</p>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded-lg">
                      <p className="text-lg font-bold text-amber-700">2.5s</p>
                      <p className="text-xs text-gray-500">Génération</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Rechercher un rapport..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
            </div>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tous les types</option>
              {Object.entries(REPORT_TYPES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tableau des rapports */}
          <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Titre</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Format</th>
                    <th className="px-6 py-3">Statut</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Taille</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map((report) => (
                    <tr 
                      key={report.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/admin/reports/${report.id}`)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{report.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{report.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getReportTypeColor(report.type)}`}>
                          {getReportTypeLabel(report.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{report.format}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getReportStatusColor(report.status)}`}>
                          {getReportStatusLabel(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{formatDateTime(report.generatedAt)}</td>
                      <td className="px-6 py-4 text-sm">{formatFileSize(report.metadata?.size || 0)}</td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Télécharger">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        Aucun rapport trouvé
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <span className="text-sm text-gray-500">{filteredReports.length} rapport(s)</span>
              <div className="flex gap-2">
                <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-purple-600 text-white rounded-lg">1</button>
                <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Badge IA */}
          <div className="text-center text-xs text-gray-400 pt-2 flex items-center justify-center gap-2">
            <Brain className="w-3 h-3 text-purple-400" />
            <span>Rapports intelligents IA • Génération automatique • Export multi-formats</span>
            <Sparkles className="w-3 h-3 text-yellow-400" />
          </div>
        </>
      )}
    </div>
  );
}