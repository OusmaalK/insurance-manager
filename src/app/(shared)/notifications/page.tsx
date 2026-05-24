// src/app/(shared)/notifications/page.tsx
// Centre de notifications (Admin & Broker)
// <140 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

// Icônes
import { Bell, CheckCircle, AlertTriangle, Info, X, Trash2, Mail, Shield, Calendar, FileText } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
  icon?: string;
}

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    
    // Simuler des notifications (à remplacer par appel API réel)
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Nouveau sinistre détecté',
        message: 'Un nouveau sinistre a été enregistré et nécessite votre attention.',
        type: 'warning',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        link: '/claims/1',
        icon: 'AlertTriangle'
      },
      {
        id: 2,
        title: 'Analyse IA terminée',
        message: 'L\'analyse IA du contrat #POL-2024-001 est disponible.',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        link: '/policies/1',
        icon: 'CheckCircle'
      },
      {
        id: 3,
        title: 'Rapport hebdomadaire',
        message: 'Votre rapport hebdomadaire est prêt à être consulté.',
        type: 'info',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        link: '/reports/1',
        icon: 'FileText'
      },
      {
        id: 4,
        title: 'Rendez-vous à confirmer',
        message: 'Vous avez un rendez-vous avec la société ABC demain à 14h.',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        link: '/calendar',
        icon: 'Calendar'
      },
      {
        id: 5,
        title: 'Alerte sécurité',
        message: 'Une nouvelle connexion a été détectée depuis un nouvel appareil.',
        type: 'error',
        read: true,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        icon: 'Shield'
      }
    ];
    
    setNotifications(mockNotifications);
    setIsLoading(false);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getTypeStyles = (type: string) => {
    const styles = {
      info: 'bg-blue-50 border-blue-200',
      warning: 'bg-yellow-50 border-yellow-200',
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200'
    };
    return styles[type as keyof typeof styles] || styles.info;
  };

  const getTypeIcon = (type: string, iconName?: string) => {
    const icons = {
      info: <Info className="w-5 h-5 text-blue-500" />,
      warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      success: <CheckCircle className="w-5 h-5 text-green-500" />,
      error: <AlertTriangle className="w-5 h-5 text-red-500" />
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement des notifications..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 mt-1">Centre de notifications</p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === 'unread' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Non lues ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === 'read' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Lues ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Liste des notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-500" />
              Historique des notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune notification</p>
                <p className="text-sm text-gray-400">Vous êtes à jour</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-lg border transition-all ${
                      !notif.read ? 'bg-white shadow-sm' : 'bg-gray-50 opacity-75'
                    } ${getTypeStyles(notif.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">{getTypeIcon(notif.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className={`font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notif.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {!notif.read && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                Nouveau
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {new Date(notif.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <div className="flex items-center gap-3 mt-3">
                          {notif.link && (
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              Voir les détails
                            </button>
                          )}
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Marquer comme lu
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-3 flex items-center justify-between">
              <div><p className="text-xs text-gray-500">Total notifications</p><p className="text-xl font-bold">{notifications.length}</p></div>
              <Bell className="w-6 h-6 text-gray-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 flex items-center justify-between">
              <div><p className="text-xs text-gray-500">Non lues</p><p className="text-xl font-bold text-yellow-600">{unreadCount}</p></div>
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 flex items-center justify-between">
              <div><p className="text-xs text-gray-500">Lues</p><p className="text-xl font-bold text-green-600">{notifications.length - unreadCount}</p></div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}