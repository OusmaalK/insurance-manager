// src/app/admin/notifications/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bell, CheckCheck, Archive, Trash2, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  getTypeLabel, getTypeColor,
  getPriorityLabel, getPriorityColor,
  getCategoryLabel, getCategoryColor,
  formatDateTime, formatTimeAgo
} from '@/types/notification.types';

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const notificationId = parseInt(params.id as string);
  const { notifications, markAsRead, archive, deleteNotification } = useNotifications();
  const [notification, setNotification] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const found = notifications.find(n => n.id === notificationId);
    setNotification(found);
    setIsLoading(false);
  }, [notificationId, notifications]);

  const handleMarkAsRead = async () => {
    await markAsRead(notificationId);
    setNotification({ ...notification, status: 'READ', readAt: new Date().toISOString() });
  };

  const handleArchive = async () => {
    await archive(notificationId);
    router.push('/admin/notifications');
  };

  const handleDelete = async () => {
    if (confirm('Confirmer la suppression ?')) {
      await deleteNotification(notificationId);
      router.push('/admin/notifications');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement..." />
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="p-6 text-center">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">Notification non trouvée</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push('/admin/notifications')}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/notifications" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Détail de la notification</h1>
          <p className="text-sm text-gray-500">ID: #{notification.id}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {notification.status !== 'READ' && (
            <Button variant="outline" onClick={handleMarkAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Marquer comme lue
            </Button>
          )}
          {notification.status !== 'ARCHIVED' && (
            <Button variant="outline" onClick={handleArchive}>
              <Archive className="w-4 h-4 mr-2" />
              Archiver
            </Button>
          )}
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}>
              {getTypeLabel(notification.type)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
              {getPriorityLabel(notification.priority)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(notification.category)}`}>
              {getCategoryLabel(notification.category)}
            </span>
            {notification.status === 'UNREAD' && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Nouvelle</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{notification.title}</h2>
            <p className="text-gray-700 mt-2">{notification.message}</p>
          </div>
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Date de création</span>
                <p className="font-medium">{formatDateTime(notification.createdAt)}</p>
              </div>
              <div>
                <span className="text-gray-500">Il y a</span>
                <p className="font-medium">{formatTimeAgo(notification.createdAt)}</p>
              </div>
              {notification.readAt && (
                <div>
                  <span className="text-gray-500">Date de lecture</span>
                  <p className="font-medium">{formatDateTime(notification.readAt)}</p>
                </div>
              )}
            </div>
          </div>
          {notification.actionUrl && (
            <div className="pt-4 border-t">
              <Button variant="primary" onClick={() => router.push(notification.actionUrl)}>
                {notification.actionLabel || 'Voir détails'} →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Notification intelligente • IA transversale</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}