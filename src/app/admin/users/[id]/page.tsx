// src/app/admin/users/[id]/page.tsx
// Page détail utilisateur avec analyse IA
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, User, Mail, Phone, Calendar, Shield, 
  Activity, TrendingUp, Brain, Sparkles, Eye, Edit, 
  Trash2, RefreshCw, CheckCircle, XCircle, AlertCircle,
  Clock, BarChart3, Target, Award, Zap, Download
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useUsers } from '@/hooks/useUsers';
import { useUserAI } from '@/hooks/useUserAI';
import { USER_ROLES, USER_STATUS, getRoleColor, getStatusColor, formatDate, formatDateTime, getRoleLabel, getStatusLabel } from '@/types/user.types';

// ============================================
// COMPOSANTS IA
// ============================================

// Widget Score d'activité
const ActivityScoreWidget = ({ analysis }: { analysis: any }) => {
  const score = analysis?.activityScore || 0;
  const getScoreColor = () => {
    if (score >= 70) return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50', label: 'Élevé' };
    if (score >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-50', label: 'Moyen' };
    return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50', label: 'Faible' };
  };
  const style = getScoreColor();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Score d'activité IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle 
                cx="64" cy="64" r="56" fill="none" 
                stroke={style.bg}
                strokeWidth="8"
                strokeDasharray={`${score * 3.52} 352`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score}%</span>
              <span className="text-xs text-gray-500">score</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${style.light} ${style.text}`}>
              Niveau {style.label}
            </span>
            <p className="text-xs text-gray-500 mt-2">
              Module le plus actif: {analysis?.mostActiveModule || 'Non déterminé'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Widget Performance
const PerformanceWidget = ({ metrics }: { metrics: any }) => {
  if (!metrics) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Métriques performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{metrics.efficiencyScore}%</p>
            <p className="text-xs text-gray-500">Efficacité</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">{metrics.clientSatisfaction}%</p>
            <p className="text-xs text-gray-500">Satisfaction</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-purple-600">{metrics.policiesManaged}</p>
            <p className="text-xs text-gray-500">Contrats gérés</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-orange-600">{metrics.claimsProcessed}</p>
            <p className="text-xs text-gray-500">Sinistres traités</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-gray-600">Tendance</span>
          <span className={`text-sm font-medium ${metrics.trend === 'up' ? 'text-green-600' : metrics.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
            {metrics.trend === 'up' ? '↑ En hausse' : metrics.trend === 'down' ? '↓ En baisse' : '→ Stable'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Widget Prédiction IA
const PredictionWidget = ({ prediction }: { prediction: any }) => {
  if (!prediction) return null;
  
  const churnColor = prediction.churnProbability >= 70 ? 'text-red-600' : 
                     prediction.churnProbability >= 40 ? 'text-orange-600' : 'text-green-600';

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Prédiction IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Risque de désengagement</span>
            <span className={churnColor}>{prediction.churnProbability}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${prediction.churnProbability >= 70 ? 'bg-red-500' : prediction.churnProbability >= 40 ? 'bg-orange-500' : 'bg-green-500'}`}
              style={{ width: `${prediction.churnProbability}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Productivité prévue</span>
            <span>{prediction.productivityForecast}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${prediction.productivityForecast}%` }} />
          </div>
        </div>
        {prediction.recommendedActions?.length > 0 && (
          <div className="mt-2 p-2 bg-amber-50 rounded-lg">
            <p className="text-xs font-medium text-amber-700">Actions recommandées:</p>
            <ul className="text-xs text-amber-600 mt-1 space-y-1">
              {prediction.recommendedActions.slice(0, 2).map((action: string, idx: number) => (
                <li key={idx}>• {action}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Widget Activités récentes
const ActivitiesWidget = ({ activities, isLoading }: { activities: any[]; isLoading: boolean }) => {
  if (isLoading) return <div className="animate-pulse h-32 bg-gray-100 rounded"></div>;
  if (!activities || activities.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune activité récente</div>;
  }

  return (
    <div className="space-y-2">
      {activities.slice(0, 5).map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.action}</p>
            <p className="text-xs text-gray-500">{activity.module} • {formatDateTime(activity.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// PAGE PRINCIPALE
// ============================================

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);
  const { getUser, getUserActivities, updateStatus, isLoading: userLoading } = useUsers();
  const { analyzeActivity, getPerformanceMetrics, predictBehavior, isLoading: aiLoading } = useUserAI();
  
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [activityAnalysis, setActivityAnalysis] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const userData = await getUser(userId);
      setUser(userData);
      
      if (userData) {
        const [acts, analysis, metrics, pred] = await Promise.all([
          getUserActivities(userId),
          analyzeActivity(userId),
          getPerformanceMetrics(userId),
          predictBehavior(userId)
        ]);
        setActivities(acts || []);
        setActivityAnalysis(analysis);
        setPerformanceMetrics(metrics);
        setPrediction(pred);
      }
    };
    load();
  }, [userId, getUser, getUserActivities, analyzeActivity, getPerformanceMetrics, predictBehavior]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const userData = await getUser(userId);
    setUser(userData);
    if (userData) {
      const [acts, analysis, metrics, pred] = await Promise.all([
        getUserActivities(userId),
        analyzeActivity(userId),
        getPerformanceMetrics(userId),
        predictBehavior(userId)
      ]);
      setActivities(acts || []);
      setActivityAnalysis(analysis);
      setPerformanceMetrics(metrics);
      setPrediction(pred);
    }
    setIsRefreshing(false);
  };

  const handleStatusUpdate = async (status: string) => {
    await updateStatus(userId, status as any);
    const userData = await getUser(userId);
    setUser(userData);
  };

  if (userLoading || aiLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-gray-600">Utilisateur non trouvé</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push('/admin/users')}>
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
          <Link href="/admin/users" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <select
            value={user.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {Object.entries(USER_STATUS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bannière IA */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-3 border border-purple-100">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">Analyse IA comportementale</p>
            <p className="text-xs text-gray-600">Score d'activité et prédictions basées sur l'historique</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue générale</TabsTrigger>
          <TabsTrigger value="ia">🤖 Analyse IA</TabsTrigger>
          <TabsTrigger value="activities">📋 Activités</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations générales */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Prénom</p>
                      <p className="font-medium">{user.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="font-medium">{user.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium">{user.phone || 'Non renseigné'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
  <div>
    <p className="text-sm text-gray-500">Prénom</p>
    <p className="font-medium">{user.firstName}</p>
  </div>
  <div>
    <p className="text-sm text-gray-500">Nom</p>
    <p className="font-medium">{user.lastName}</p>
  </div>
  <div>
    <p className="text-sm text-gray-500">Email</p>
    <p className="font-medium">{user.email}</p>
  </div>
  <div>
    <p className="text-sm text-gray-500">Téléphone</p>
    <p className="font-medium">{user.phone || 'Non renseigné'}</p>
  </div>
  <div>
    <p className="text-sm text-gray-500">Rôle</p>
    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
      {getRoleLabel(user.role)}
    </span>
  </div>
  <div>
    <p className="text-sm text-gray-500">Statut</p>
    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
      {getStatusLabel(user.status)}
    </span>
  </div>
  <div>
    <p className="text-sm text-gray-500">Date création</p>
    <p className="font-medium">{formatDate(user.createdAt)}</p>
  </div>
  <div>
    <p className="text-sm text-gray-500">Dernière connexion</p>
    <p className="font-medium">{formatDate(user.lastLogin)}</p>
  </div>
</div>
                    <div>
                      <p className="text-sm text-gray-500">Date création</p>
                      <p className="font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dernière connexion</p>
                      <p className="font-medium">{formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Widgets */}
            <div className="space-y-6">
              <ActivityScoreWidget analysis={activityAnalysis} />
              <PerformanceWidget metrics={performanceMetrics} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ia">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityScoreWidget analysis={activityAnalysis} />
            <PerformanceWidget metrics={performanceMetrics} />
            <PredictionWidget prediction={prediction} />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Recommandations IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {activityAnalysis?.recommendations?.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                  {(!activityAnalysis?.recommendations || activityAnalysis.recommendations.length === 0) && (
                    <li className="text-sm text-gray-500">Aucune recommandation pour le moment</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                Historique des activités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivitiesWidget activities={activities} isLoading={userLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Badge IA */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Analyse comportementale IA • Mise à jour en temps réel</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}