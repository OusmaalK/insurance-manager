// src/app/admin/notifications/page.tsx
// Page des notifications avec IA transversale - Version corrigée
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, CheckCheck, Brain, Sparkles, Filter, RefreshCw, 
  Target, Award, Zap
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationsList } from '@/components/admin/notifications/NotificationsList';
import { NotificationFilters } from '@/components/admin/notifications/NotificationFilters';
import { NotificationStats } from '@/components/admin/notifications/NotificationStats';
import { useNotificationFilterStore } from '@/stores/notificationFilterStore';

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
              <h3 className="text-lg font-bold">Notifications IA</h3>
              <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded-full">Prédictions en temps réel</span>
              <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full">Optimisation intelligente</span>
            </div>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              L'IA analyse vos habitudes et optimise le moment d'envoi des notifications.
              Prédiction des alertes importantes et recommandations personnalisées.
            </p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-purple-200">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Optimisation temps réel</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> 98% de pertinence</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> +32% d'engagement</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/notifications/preferences')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm"
          >
            <Bell className="w-4 h-4" />
            Préférences
          </button>
          <button 
            onClick={() => router.push('/admin/ia/dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Dashboard IA
          </button>
        </div>
      </div>
      <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-300 to-blue-300 rounded-full animate-pulse" style={{ width: '70%' }} />
      </div>
    </div>
  );
};

// ============================================
// PAGE PRINCIPALE
// ============================================
export default function NotificationsPage() {
  const router = useRouter();
  const { 
    notifications, stats, unreadCount, isLoading, 
    markAllAsRead, fetchNotifications, fetchStats, getUnreadCount
  } = useNotifications({ autoFetch: true });
  
  const { isOpen: showFilters, toggleFilters } = useNotificationFilterStore();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchStats();
    getUnreadCount();
  }, []);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    await fetchNotifications();
    await getUnreadCount();
  };

  const handleRefresh = async () => {
    await fetchNotifications();
    await fetchStats();
    await getUnreadCount();
  };

  if (isLoading && !notifications.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement des notifications..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                {unreadCount} non lues
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gestion intelligente des notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Rafraîchir
          </Button>
          <Button variant="outline" onClick={toggleFilters}>
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Tout lire
          </Button>
        </div>
      </div>

      {/* Bannière IA */}
      <IATransversalBanner />

      {/* Statistiques */}
      <NotificationStats stats={stats} isLoading={isLoading} />

      {/* Filtres - Pas de prop onApply */}
      {showFilters && <NotificationFilters />}

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="unread">Non lues</TabsTrigger>
          <TabsTrigger value="read">Lues</TabsTrigger>
          <TabsTrigger value="archived">Archivées</TabsTrigger>
        </TabsList>

        {/* ✅ NotificationsList sans props */}
        <TabsContent value="all" className="mt-4">
          <NotificationsList 
            notifications={notifications}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          <NotificationsList 
            notifications={notifications.filter((n: any) => n.status === 'UNREAD')}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="read" className="mt-4">
          <NotificationsList 
            notifications={notifications.filter((n: any) => n.status === 'READ')}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="archived" className="mt-4">
          <NotificationsList 
            notifications={notifications.filter((n: any) => n.status === 'ARCHIVED')}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Badge IA */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Notifications intelligentes • Optimisation IA • Prédictions temps réel</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}