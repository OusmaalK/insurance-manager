// src/app/admin/ia/dashboard/page.tsx
// Tableau de bord IA - Vue globale de l'intelligence artificielle transversale
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Brain,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Database,
  Cpu,
  Network,
  RefreshCw,
  Download,
  Calendar,
  Eye,
  Sparkles,
  Target,
  Award,
  Gauge,
  Microscope,
  Radio,
  Server,
  Cloud,
  Lock,
  FileText,
  Users,
  Building2
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

// ============================================
// TYPES
// ============================================

interface IAMetrics {
  totalPredictions: number;
  accuracy: number;
  avgResponseTime: number;
  activeAlerts: number;
  totalAnalyses: number;
  costSaved: number;
  fraudDetected: number;
  riskPrevented: number;
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  lastCheck: string;
}

interface RecentAnalysis {
  id: string;
  type: 'risk' | 'fraud' | 'prediction' | 'recommendation';
  entity: string;
  score: number;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
}

// ============================================
// COMPOSANTS DE STATS
// ============================================

const MetricCard = ({ title, value, icon: Icon, color, trend, description }: any) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          trend > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
    {description && <p className="text-xs text-gray-400 mt-2">{description}</p>}
  </div>
);

const ServiceStatusBadge = ({ status }: { status: ServiceStatus['status'] }) => {
  const config = {
    operational: { bg: 'bg-green-100', text: 'text-green-700', label: 'Opérationnel', dot: 'bg-green-500' },
    degraded: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Dégradé', dot: 'bg-yellow-500' },
    down: { bg: 'bg-red-100', text: 'text-red-700', label: 'Indisponible', dot: 'bg-red-500' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  );
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function IADashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<IAMetrics>({
    totalPredictions: 0,
    accuracy: 0,
    avgResponseTime: 0,
    activeAlerts: 0,
    totalAnalyses: 0,
    costSaved: 0,
    fraudDetected: 0,
    riskPrevented: 0,
  });
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Gemini API', status: 'operational', latency: 120, lastCheck: new Date().toISOString() },
    { name: 'Scoring Risque', status: 'operational', latency: 45, lastCheck: new Date().toISOString() },
    { name: 'Détection Fraude', status: 'operational', latency: 89, lastCheck: new Date().toISOString() },
    { name: 'Prédictions', status: 'operational', latency: 67, lastCheck: new Date().toISOString() },
    { name: 'Recommandations', status: 'degraded', latency: 234, lastCheck: new Date().toISOString() },
  ]);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([
    { id: '1', type: 'risk', entity: 'AXA France', score: 15, timestamp: '2026-05-23T10:30:00', status: 'completed' },
    { id: '2', type: 'fraud', entity: 'Generali', score: 78, timestamp: '2026-05-23T09:45:00', status: 'completed' },
    { id: '3', type: 'prediction', entity: 'Allianz', score: 92, timestamp: '2026-05-23T08:15:00', status: 'completed' },
    { id: '4', type: 'recommendation', entity: 'Groupama', score: 67, timestamp: '2026-05-22T16:20:00', status: 'completed' },
    { id: '5', type: 'risk', entity: 'MAAF', score: 34, timestamp: '2026-05-22T14:00:00', status: 'processing' },
  ]);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setMetrics({
        totalPredictions: 1247,
        accuracy: 94.2,
        avgResponseTime: 0.8,
        activeAlerts: 23,
        totalAnalyses: 3456,
        costSaved: 125000,
        fraudDetected: 18,
        riskPrevented: 42,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const getAnalysisTypeIcon = (type: RecentAnalysis['type']) => {
    switch (type) {
      case 'risk': return <Shield className="w-4 h-4 text-amber-500" />;
      case 'fraud': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'prediction': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'recommendation': return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  const getAnalysisScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-50';
    if (score < 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement du tableau de bord IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord IA</h1>
            <p className="text-sm text-gray-500">Vue d'ensemble de l'intelligence artificielle transversale</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Rafraîchir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter rapport
          </Button>
        </div>
      </div>

      {/* Bannière IA */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Intelligence Artificielle Transversale
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Gemini 2.0 Flash</span>
              </h2>
              <p className="text-purple-100 text-sm mt-1 max-w-2xl">
                IA en temps réel qui traverse tous les modules : scoring risque, détection fraude, prédictions, recommandations cross-sell
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-purple-200">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Temps réel</span>
                <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Précision 94.2%</span>
                <span className="flex items-center gap-1"><Award className="w-3 h-3" /> 1.2M prédictions</span>
                <span className="flex items-center gap-1"><Database className="w-3 h-3" /> 50K+ analyses</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-purple-200">Disponibilité</p>
            </div>
            <div className="w-px h-10 bg-white/20 mx-2" />
            <div className="text-right">
              <p className="text-2xl font-bold">&lt;1s</p>
              <p className="text-xs text-purple-200">Latence moyenne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="Précision globale" value={`${metrics.accuracy}%`} icon={Target} color="bg-emerald-500" trend={5} description="vs mois dernier" />
        <MetricCard title="Prédictions IA" value={metrics.totalPredictions.toLocaleString()} icon={Brain} color="bg-purple-500" trend={24} description="ce mois" />
        <MetricCard title="Alertes actives" value={metrics.activeAlerts} icon={AlertTriangle} color="bg-amber-500" trend={-8} description="en traitement" />
        <MetricCard title="Temps réponse" value={`${metrics.avgResponseTime}s`} icon={Gauge} color="bg-blue-500" trend={-12} description="moyenne" />
      </div>

      {/* Grille secondaire */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard title="Économies estimées" value={`${(metrics.costSaved / 1000).toFixed(0)}k€`} icon={WalletIcon} color="bg-green-500" trend={34} description="grâce à l'IA" />
        <MetricCard title="Fraudes détectées" value={metrics.fraudDetected} icon={Shield} color="bg-red-500" trend={28} description="ce trimestre" />
        <MetricCard title="Risques prévenus" value={metrics.riskPrevented} icon={CheckCircle} color="bg-indigo-500" trend={42} description="sinistres évités" />
      </div>

      {/* Services et Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statut des services IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-500" />
              Statut des services IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Cpu className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-400">Latence: {service.latency}ms</p>
                  </div>
                </div>
                <ServiceStatusBadge status={service.status} />
              </div>
            ))}
            <div className="pt-3 text-center text-xs text-gray-400">
              Dernière vérification: {new Date().toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>

        {/* Analyses récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-500" />
              Analyses récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {getAnalysisTypeIcon(analysis.type)}
                    <div>
                      <p className="font-medium text-gray-900">{analysis.entity}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(analysis.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getAnalysisScoreColor(analysis.score)}`}>
                      Score: {analysis.score}%
                    </span>
                    {analysis.status === 'processing' && (
                      <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Performance IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-gray-500" />
              Évolution des performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2 pt-4">
              {[78, 82, 85, 88, 90, 92, 91, 93, 94, 94.2].map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-purple-500 rounded-t-lg transition-all hover:bg-purple-600" style={{ height: `${(value / 100) * 200}px` }} />
                  <span className="text-[10px] text-gray-400 transform rotate-45 origin-left">S{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded" />Précision modèle</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded" />Taux confiance</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gray-500" />
              Distribution des analyses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
              <span className="text-sm">Scoring risque</span>
              <span className="font-bold">38%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
              <span className="text-sm">Prédictions</span>
              <span className="font-bold">27%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
              <span className="text-sm">Détection fraude</span>
              <span className="font-bold">20%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
              <span className="text-sm">Recommandations</span>
              <span className="font-bold">15%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Link href="/admin/companies">
            <Button variant="outline" size="sm">← Entreprises</Button>
          </Link>
          <Link href="/admin/ia/audit">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Audit IA
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Cloud className="w-3 h-3" />
          <span>Dernière synchronisation: {new Date().toLocaleTimeString()}</span>
          <Lock className="w-3 h-3 ml-2" />
          <span>Connexion sécurisée</span>
        </div>
      </div>
    </div>
  );
}

// Icône Wallet manquante
const WalletIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M6 6h12M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
  </svg>
);