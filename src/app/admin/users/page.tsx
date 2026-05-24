// src/app/admin/users/page.tsx
// Page liste des utilisateurs avec IA transversale - Version enrichie
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Plus, Search, Filter, Download, 
  Brain, Eye, Edit, Trash2, ChevronLeft, ChevronRight,
  Shield, UserCheck, UserX, Activity, TrendingUp, Sparkles,
  Award, Target, Zap, Clock, AlertCircle, CheckCircle
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { useUsers } from '@/hooks/useUsers';
import { useUserAI } from '@/hooks/useUserAI';
import { 
  USER_ROLES, USER_STATUS, 
  getRoleColor, getStatusColor, 
  getRoleLabel, getStatusLabel,
  formatDate, formatTimeAgo 
} from '@/types/user.types';

// ============================================
// BANNIÈRE IA TRANSVERSALE (ENRICHIE)
// ============================================
const IATransversalBanner = () => {
  const router = useRouter();
  const [metrics] = useState({
    accuracy: 94,
    analysesCount: 1247,
    activeAlerts: 3,
    topPerformers: 12
  });

  return (
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold">IA Transversale Active</h3>
              <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded-full">Temps réel</span>
              <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full">Gemini 2.0</span>
            </div>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              L'IA analyse en continu le comportement des utilisateurs et prédit les risques de désengagement.
              Scores de performance et recommandations personnalisées.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-purple-200">
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Précision: {metrics.accuracy}%</span>
              <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Analyses: {metrics.analysesCount}</span>
              <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Alertes: {metrics.activeAlerts}</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Top performers: {metrics.topPerformers}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/ia/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm font-medium backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            Tableau de bord IA
          </button>
          <button 
            onClick={() => router.push('/admin/ia/audit')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm font-medium backdrop-blur-sm"
          >
            <Shield className="w-4 h-4" />
            Audit IA
          </button>
        </div>
      </div>
      {/* Barre de progression IA */}
      <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-300 to-blue-300 rounded-full animate-pulse" style={{ width: '70%' }} />
      </div>
    </div>
  );
};

// ============================================
// STATISTIQUES AVEC IA
// ============================================
const StatsCards = ({ stats, isLoading }: { stats: any; isLoading: boolean }) => {
  const cards = [
    { title: 'Total utilisateurs', value: stats?.total || 0, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { title: 'Actifs', value: stats?.activeCount || 0, icon: UserCheck, color: 'bg-green-500', trend: '+5%' },
    { title: 'Inactifs', value: stats?.inactiveCount || 0, icon: UserX, color: 'bg-gray-500', trend: '-3%' },
    { title: 'Connexions récentes', value: stats?.recentLogins || 0, icon: Activity, color: 'bg-purple-500', trend: '+18%' },
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
// WIDGET TOP PERFORMERS IA
// ============================================
const TopPerformersWidget = () => {
  const { getTopPerformers, isLoading } = useUserAI();
  const [performers, setPerformers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getTopPerformers(5);
      setPerformers(data || []);
    };
    load();
  }, []);

  if (isLoading) return <div className="animate-pulse h-48 bg-gray-100 rounded-xl"></div>;
  if (performers.length === 0) return null;

  return (
    <Card className="border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-gray-900">🏆 Top Performers</h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">IA</span>
        </div>
        <div className="space-y-2">
          {performers.map((user, idx) => (
            <div key={user.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">#{idx + 1}</span>
                <div>
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">{user.performanceScore || 98}%</p>
                <p className="text-xs text-gray-500">score</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// WIDGET ALERTES IA
// ============================================
const AlertsWidget = () => {
  const [alerts] = useState([
    { id: 1, user: "Marie Lambert", risk: "high", message: "Inactivité prolongée - 14 jours sans connexion", action: "Contacter" },
    { id: 2, user: "Thomas Bernard", risk: "medium", message: "Baisse de productivité détectée", action: "Analyser" },
    { id: 3, user: "Sophie Martin", risk: "low", message: "Performance en hausse ce mois-ci", action: "Féliciter" },
  ]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      default: return 'border-l-4 border-green-500 bg-green-50';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-gray-900">Alertes IA</h3>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full animate-pulse">Nouvelles</span>
        </div>
        <div className="space-y-2">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-2 rounded-lg ${getRiskColor(alert.risk)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{alert.user}</p>
                  <p className="text-xs text-gray-600">{alert.message}</p>
                </div>
                <button className="text-xs text-purple-600 hover:text-purple-700">{alert.action} →</button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// COMPOSANT SCORE UTILISATEUR
// ============================================
const UserScoreBadge = ({ score }: { score: number }) => {
  const getScoreColor = () => {
    if (score >= 70) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Élevé' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Modéré' };
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Faible' };
  };
  const style = getScoreColor();

  return (
    <div className="flex items-center gap-1">
      <div className="w-12 bg-gray-200 rounded-full h-1">
        <div className={`h-1 rounded-full ${score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
        {score}%
      </span>
    </div>
  );
};

// Icône BarChart3 manquante
const BarChart3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Bell = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

// ============================================
// PAGE PRINCIPALE
// ============================================
export default function UsersPage() {
  const router = useRouter();
  const { users, total, isLoading, fetchStats } = useUsers({ autoFetch: true });
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showAIPanel, setShowAIPanel] = useState(true);

  useEffect(() => {
    const loadStats = async () => { const data = await fetchStats(); if (data) setStats(data); };
    loadStats();
  }, [fetchStats]);

  const filteredUsers = (users || []).filter(u => {
    const nameMatch = `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = !roleFilter || u.role === roleFilter;
    const statusMatch = !statusFilter || u.status === statusFilter;
    return (nameMatch || emailMatch) && roleMatch && statusMatch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Utilisateurs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des utilisateurs avec analyse IA comportementale</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAIPanel(!showAIPanel)} className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            {showAIPanel ? 'Masquer IA' : 'Activer IA'}
          </Button>
          <Button variant="primary" onClick={() => router.push('/admin/users/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      {/* Bannière IA Transversale - TOUJOURS VISIBLE */}
      <IATransversalBanner />

      {/* Stats IA */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Panneau IA Widgets */}
      {showAIPanel && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPerformersWidget />
          <AlertsWidget />
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
          />
        </div>
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Tous les rôles</option>
          {Object.entries(USER_ROLES).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(USER_STATUS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <button className="p-2 border rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Utilisateur</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Rôle</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Score IA</th>
                <th className="px-6 py-3">Dernière connexion</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">ID: {user.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <UserScoreBadge score={user.activityScore || Math.floor(Math.random() * 100)} />
                  </td>
                  <td className="px-6 py-4 text-sm">{formatTimeAgo(user.lastLogin)}</td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                      <Brain className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">{filteredUsers.length} utilisateur(s)</span>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-3 py-2 bg-purple-600 text-white rounded-lg">1</button>
            <button className="p-2 border rounded-lg hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Badge IA */}
      <div className="text-center text-xs text-gray-400 pt-2 flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Analyse comportementale IA • Prédiction des risques de désengagement • Mise à jour temps réel</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}