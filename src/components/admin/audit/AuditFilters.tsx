// src/components/admin/audit/AuditFilters.tsx
'use client';

import { X, Search } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { AUDIT_MODULES, AUDIT_SEVERITY, AUDIT_STATUS } from '@/types/audit.types';
import { useAuditFilterStore } from '@/stores/auditFilterStore';

export const AuditFilters = () => {
  const { filters, isOpen, setFilter, resetFilters, closeFilters } = useAuditFilterStore();

  if (!isOpen) return null;

  const handleApply = () => {
    // Les filtres sont déjà dans le store, on ferme simplement
    closeFilters();
  };

  const handleReset = () => {
    resetFilters();
    closeFilters();
  };

  const handleClose = () => {
    closeFilters();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Filtres avancés</CardTitle>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Module</label>
            <select
              value={filters.module}
              onChange={(e) => setFilter('module', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Tous les modules</option>
              {Object.entries(AUDIT_MODULES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sévérité</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilter('severity', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Toutes les sévérités</option>
              {Object.entries(AUDIT_SEVERITY).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(AUDIT_STATUS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                placeholder="Action, utilisateur..."
                className="w-full pl-9 pr-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date début</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilter('startDate', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date fin</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilter('endDate', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleReset}>Réinitialiser</Button>
          <Button variant="primary" onClick={handleApply}>Appliquer</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditFilters;