// src/components/admin/notifications/NotificationStats.tsx
'use client';

import { Bell, CheckCheck, Archive, TrendingUp, Clock, Brain, Activity, Zap } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/Card';

interface NotificationStatsProps {
  stats: {
    total: number;
    unread: number;
    read: number;
    archived: number;
    byType?: { type: string; count: number }[];
    byPriority?: { priority: string; count: number }[];
    recentActivity?: number;
    averageResponseTime?: number;
    aiPredictions?: {
      expectedAlerts: number;
      optimalDigestTime: string;
      userEngagementScore: number;
    };
  } | null;
  isLoading: boolean;
  variant?: 'default' | 'compact';
}

export const NotificationStats = ({ stats, isLoading, variant = 'default' }: NotificationStatsProps) => {
  const mainCards = [
    { title: 'Total', value: stats?.total?.toLocaleString() || '0', icon: Bell, color: 'bg-blue-500', description: 'notifications' },
    { title: 'Non lues', value: stats?.unread?.toLocaleString() || '0', icon: CheckCheck, color: 'bg-red-500', description: 'à traiter' },
    { title: 'Lues', value: stats?.read?.toLocaleString() || '0', icon: Activity, color: 'bg-green-500', description: 'consultées' },
    { title: 'Archivées', value: stats?.archived?.toLocaleString() || '0', icon: Archive, color: 'bg-gray-500', description: 'archivées' },
  ];

  const compactCards = [
    { title: 'Total', value: stats?.total?.toLocaleString() || '0', icon: Bell, color: 'bg-blue-500' },
    { title: 'Non lues', value: stats?.unread?.toLocaleString() || '0', icon: CheckCheck, color: 'bg-red-500' },
    { title: 'Lues', value: stats?.read?.toLocaleString() || '0', icon: Activity, color: 'bg-green-500' },
    { title: 'Archivées', value: stats?.archived?.toLocaleString() || '0', icon: Archive, color: 'bg-gray-500' },
  ];

  const displayCards = variant === 'compact' ? compactCards : mainCards;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse bg-white rounded-xl border p-4 h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayCards.map((card, idx) => (
          <div key={idx} className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className={`${card.color} p-2 rounded-lg`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
              {(card as any).trend && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {(card as any).trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            {(card as any).description && (
              <p className="text-xs text-gray-400 mt-1">{(card as any).description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Métriques IA (uniquement en mode default) */}
      {variant !== 'compact' && stats?.aiPredictions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">Alertes prédites</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.aiPredictions.expectedAlerts}</p>
              <p className="text-xs text-blue-600 mt-1">dans les prochaines 24h</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">Meilleur moment</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.aiPredictions.optimalDigestTime}</p>
              <p className="text-xs text-green-600 mt-1">pour envoyer le résumé</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">Engagement</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{stats.aiPredictions.userEngagementScore}%</p>
              <p className="text-xs text-purple-600 mt-1">score de pertinence prédit</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statistiques supplémentaires */}
      {variant !== 'compact' && (stats?.byType || stats?.byPriority) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stats?.byType && stats.byType.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Par type</h3>
                <div className="space-y-2">
                  {stats.byType.slice(0, 5).map((item) => (
                    <div key={item.type} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{item.type.toLowerCase()}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${(item.count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {stats?.byPriority && stats.byPriority.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Par priorité</h3>
                <div className="space-y-2">
                  {stats.byPriority.map((item) => (
                    <div key={item.priority} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{item.priority.toLowerCase()}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-orange-500 h-1.5 rounded-full"
                            style={{ width: `${(item.count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Badge récapitulatif */}
      {variant !== 'compact' && stats && (
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            <span>Activité récente: {stats.recentActivity || 0} notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Temps de réponse moyen: {stats.averageResponseTime || 0} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-3 h-3 text-purple-400" />
            <span>Optimisé par IA</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Supprimez les composants Brain et CheckCircle locaux
// Ils ne sont pas nécessaires car vous importez Brain depuis lucide-react
// La fonction CheckCircle n'est pas utilisée dans ce composant

export default NotificationStats;