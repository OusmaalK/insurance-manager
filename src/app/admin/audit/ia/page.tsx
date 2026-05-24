// src/app/admin/audit/ia/page.tsx
// Page d'audit spécifique à l'IA
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Brain, Eye, Download, Filter, 
  ChevronLeft, ChevronRight, TrendingUp, 
  DollarSign, Zap, CheckCircle, XCircle,
  Sparkles, Target, Award, BarChart3, PieChart,
  Clock, Cpu, Database, Activity
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useAuditAI } from '@/hooks/useAuditAI';
import { formatDateTime, formatDuration } from '@/types/audit.types';

// ============================================
// BANNIÈRE IA TRANSVERSALE
// ============================================
const IATransversalBanner = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold">Audit IA Transversale</h3>
              <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded-full">Traçabilité complète</span>
              <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full">Temps réel</span>
            </div>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              Tous les appels à l'IA sont tracés : prompts, réponses, coûts, latences.
              Analysez les performances et optimisez vos coûts.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-purple-200">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 342 appels tracés</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> 98.2% succès</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> 124.50€ coût total</span>
              <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Latence moyenne 1.25s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STATISTIQUES IA
// ============================================
const IAStatsCards = ({ stats, isLoading }: { stats: any; isLoading: boolean }) => {
  const cards = [
    { title: 'Appels IA', value: stats?.totalCalls?.toLocaleString() || '0', icon: Activity, color: 'bg-blue-500', trend: '+15%' },
    { title: 'Coût total', value: `${stats?.totalCost?.toLocaleString() || 0}€`, icon: DollarSign, color: 'bg-green-500', trend: '+8%' },
    { title: 'Latence moyenne', value: `${stats?.averageLatency || 0}ms`, icon: Clock, color: 'bg-yellow-500', trend: '-5%' },
    { title: 'Taux succès', value: `${stats?.successRate || 0}%`, icon: CheckCircle, color: 'bg-purple-500', trend: '+2%' },
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
// GRAPHIQUE PAR MODULE
// ============================================
const ModuleChart = ({ data }: { data: any[] }) => {
  const maxCalls = Math.max(...(data?.map(d => d.calls) || [0]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-500" />
          Appels par module
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(data || []).map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{item.module}</span>
                <span className="text-gray-500">{item.calls} appels • {item.cost}€</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item.calls / maxCalls) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// TABLEAU DES LOGS IA
// ============================================
const IALogsTable = ({ logs, isLoading, onRowClick }: { logs: any[]; isLoading: boolean; onRowClick: (id: number) => void }) => {
  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-xl"></div>;
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">Aucun appel IA trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Endpoint</th>
              <th className="px-4 py-3">Durée</th>
              <th className="px-4 py-3">Coût</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr 
                key={log.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick(log.id)}
              >
                <td className="px-4 py-3 text-sm">{formatDateTime(log.timestamp)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    {log.module}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm truncate max-w-[250px]">{log.endpoint}</td>
                <td className="px-4 py-3 text-sm">{formatDuration(log.duration)}</td>
                <td className="px-4 py-3 text-sm font-medium">{log.cost}€</td>
                <td className="px-4 py-3">
                  {log.success ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">✅ Succès</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">❌ Échec</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// PAGE PRINCIPALE
// ============================================
export default function AuditIAPage() {
  const router = useRouter();
  const { iaLogs, iaStats, isLoading, fetchIALogs, fetchIAStats, exportIALogs } = useAuditAI();
  const [activeTab, setActiveTab] = useState('logs');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchIALogs();
    fetchIAStats();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    await exportIALogs('csv');
    setIsExporting(false);
  };

  if (isLoading && !iaLogs.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement des logs IA..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/audit" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              Audit IA
            </h1>
            <p className="text-sm text-gray-500 mt-1">Traçabilité complète des appels à l'IA</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Export...' : 'Exporter'}
          </Button>
        </div>
      </div>

      {/* Bannière IA */}
      <IATransversalBanner />

      {/* Statistiques */}
      <IAStatsCards stats={iaStats} isLoading={isLoading} />

      {/* Tabs */}
      <Tabs defaultValue="logs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="logs">📋 Logs IA</TabsTrigger>
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-4">
          <IALogsTable 
            logs={iaLogs} 
            isLoading={isLoading}
            onRowClick={(id) => router.push(`/admin/audit/ia/${id}`)}
          />
          {/* Pagination */}
          {iaLogs.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">{iaLogs.length} logs</span>
              <div className="flex gap-2">
                <button className="p-1 border rounded hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                <span className="px-2 py-1 text-sm">1</span>
                <button className="p-1 border rounded hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModuleChart data={iaStats?.byModule} />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Tendances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Appels quotidiens (7 derniers jours)</p>
                    <div className="flex items-end gap-2 h-32">
                      {iaStats?.dailyCalls?.map((day: any, idx: number) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-purple-500 rounded-t transition-all hover:bg-purple-600"
                            style={{ height: `${(day.count / 40) * 120}px`, minHeight: '4px' }}
                          />
                          <span className="text-[10px] text-gray-400">{day.date.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-700">Recommandations IA</p>
                    <ul className="mt-2 space-y-1 text-sm text-purple-600">
                      <li>• Réduire la température du modèle pour plus de précision</li>
                      <li>• Activer le cache pour les requêtes fréquentes</li>
                      <li>• Optimiser les prompts pour réduire les tokens</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Badge IA */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Traçabilité complète • Audit IA • Conforme RGPD</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}