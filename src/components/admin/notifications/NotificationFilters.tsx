// src/components/admin/notifications/NotificationFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { NOTIFICATION_TYPES, NOTIFICATION_PRIORITIES, NOTIFICATION_CATEGORIES } from '@/types/notification.types';
import { useNotificationFilterStore } from '@/stores/notificationFilterStore';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationFilters = () => {
  const { isOpen, filters, setFilter, resetFilters, closeFilters, getActiveFilters } = useNotificationFilterStore();
  const { updateFilters } = useNotifications();
  const [localFilters, setLocalFilters] = useState(filters);

  // Synchroniser les filtres locaux avec le store
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    const activeFilters = getActiveFilters();
    updateFilters(activeFilters);
    closeFilters();
  };

  const handleReset = () => {
    setLocalFilters({
      type: '',
      priority: '',
      category: '',
      search: '',
      status: '',
      period: '',
    });
    resetFilters();
    updateFilters({});
    closeFilters();
  };

  const handleLocalChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    setFilter(key, value);
  };

  if (!isOpen) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Filtres avancés</CardTitle>
          <button onClick={closeFilters} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de notification
            </label>
            <select
              value={localFilters.type}
              onChange={(e) => handleLocalChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tous les types</option>
              {Object.entries(NOTIFICATION_TYPES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {/* Priorité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              value={localFilters.priority}
              onChange={(e) => handleLocalChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Toutes les priorités</option>
              {Object.entries(NOTIFICATION_PRIORITIES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => handleLocalChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Toutes les catégories</option>
              {Object.entries(NOTIFICATION_CATEGORIES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={localFilters.search}
                onChange={(e) => handleLocalChange('search', e.target.value)}
                placeholder="Titre, message..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={localFilters.status}
              onChange={(e) => handleLocalChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tous les statuts</option>
              <option value="UNREAD">Non lues</option>
              <option value="READ">Lues</option>
              <option value="ARCHIVED">Archivées</option>
            </select>
          </div>

          {/* Période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <select
              value={localFilters.period}
              onChange={(e) => handleLocalChange('period', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Toute période</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Appliquer les filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationFilters;