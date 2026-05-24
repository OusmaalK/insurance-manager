// src/components/admin/notifications/NotificationsList.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCheck, Archive, Trash2, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { 
  getTypeLabel, getTypeColor,
  getPriorityLabel, getPriorityColor,
  formatTimeAgo
} from '@/types/notification.types';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationStore } from '@/stores/notificationStore';

interface NotificationsListProps {
  notifications: any[];
  isLoading: boolean;
}

export const NotificationsList = ({ notifications, isLoading }: NotificationsListProps) => {
  const router = useRouter();
  const { markAsRead, archive, deleteNotification } = useNotifications();
  const { openDeleteConfirm } = useNotificationStore();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(id);
    await markAsRead(id);
    setActionLoading(null);
  };

  const handleArchive = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(id);
    await archive(id);
    setActionLoading(null);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Confirmer la suppression ?')) {
      setActionLoading(id);
      await deleteNotification(id);
      setActionLoading(null);
    }
  };

  const handleRowClick = (id: number) => {
    router.push(`/admin/notifications/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-4 h-24"></div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">Aucune notification</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="divide-y divide-gray-100">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
              notification.status === 'UNREAD' ? 'bg-blue-50/30' : ''
            }`}
            onClick={() => handleRowClick(notification.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(notification.type)}`}>
                    {getTypeLabel(notification.type)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(notification.priority)}`}>
                    {getPriorityLabel(notification.priority)}
                  </span>
                  {notification.status === 'UNREAD' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Nouvelle</span>
                  )}
                </div>
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.createdAt)}</p>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                {notification.status !== 'READ' && (
                  <button 
                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                    disabled={actionLoading === notification.id}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                    title="Marquer comme lue"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notification.status !== 'ARCHIVED' && (
                  <button 
                    onClick={(e) => handleArchive(notification.id, e)}
                    disabled={actionLoading === notification.id}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Archiver"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={(e) => handleDelete(notification.id, e)}
                  disabled={actionLoading === notification.id}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t flex justify-between items-center">
        <span className="text-sm text-gray-500">{notifications.length} notification(s)</span>
        <div className="flex gap-2">
          <button className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg">1</span>
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsList;