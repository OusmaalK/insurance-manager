// src/components/admin/notifications/NotificationCard.tsx
'use client';

import { Eye, CheckCheck, Archive, Trash2, Bell, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { 
  getTypeLabel, getTypeColor,
  getPriorityLabel, getPriorityColor,
  formatTimeAgo
} from '@/types/notification.types';

interface NotificationCardProps {
  notification: {
    id: number;
    title: string;
    message: string;
    type: string;
    priority: string;
    status: string;
    category: string;
    createdAt: string;
    actionUrl?: string;
    actionLabel?: string;
  };
  onMarkAsRead?: (id: number) => Promise<void>;
  onArchive?: (id: number) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onClick?: (id: number) => void;
  variant?: 'default' | 'compact';
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'SUCCESS': return <CheckCircle className="w-4 h-4" />;
    case 'ERROR': return <AlertCircle className="w-4 h-4" />;
    case 'WARNING': return <AlertTriangle className="w-4 h-4" />;
    case 'ALERT': return <Bell className="w-4 h-4" />;
    default: return <Info className="w-4 h-4" />;
  }
};

export const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onArchive, 
  onDelete, 
  onClick,
  variant = 'default'
}: NotificationCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(notification.id);
    }
  };

  if (variant === 'compact') {
    return (
      <div 
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
          notification.status === 'UNREAD' ? 'bg-blue-50/30 border-l-4 border-blue-500' : 'bg-white'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-1.5 rounded-lg ${getTypeColor(notification.type)}`}>
            {getTypeIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
            <p className="text-xs text-gray-500 truncate">{notification.message}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{formatTimeAgo(notification.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {notification.status !== 'READ' && onMarkAsRead && (
            <button 
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
              title="Marquer comme lue"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          )}
          {notification.status !== 'ARCHIVED' && onArchive && (
            <button 
              onClick={() => onArchive(notification.id)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
              title="Archiver"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(notification.id)}
              className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer ${
        notification.status === 'UNREAD' ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-200'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getTypeColor(notification.type)}`}>
              {getTypeIcon(notification.type)}
              <span>{getTypeLabel(notification.type)}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(notification.priority)}`}>
              {getPriorityLabel(notification.priority)}
            </span>
            {notification.status === 'UNREAD' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Nouvelle</span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
          <p className="text-sm text-gray-600">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.createdAt)}</p>
        </div>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {notification.status !== 'READ' && onMarkAsRead && (
            <button 
              onClick={() => onMarkAsRead(notification.id)}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              title="Marquer comme lue"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          {notification.status !== 'ARCHIVED' && onArchive && (
            <button 
              onClick={() => onArchive(notification.id)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Archiver"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(notification.id)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {notification.actionUrl && (
        <div className="mt-3 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => window.location.href = notification.actionUrl!}>
            {notification.actionLabel || 'Voir détails'} →
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;