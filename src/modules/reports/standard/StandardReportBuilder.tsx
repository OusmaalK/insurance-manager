// src/modules/reports/shared/ReportFilters.tsx
// Version finale corrigée - Sans 'use client'

import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Filter, Search, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface ReportFilters {
  dateRange: { start: string; end: string };
  status?: string[];
  type?: string[];
  companyId?: number;
  minAmount?: number;
  maxAmount?: number;
}

interface ReportFiltersProps {
  onApply: (filters: ReportFilters) => void;
  onReset?: () => void;
  showCompanyFilter?: boolean;
  showStatusFilter?: boolean;
  showAmountFilter?: boolean;
}

export const ReportFilters = ({
  onApply,
  onReset,
  showStatusFilter = true,
}: ReportFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    status: [],
    type: [],
  });

  // ✅ Correction : Vérification avant appel
  const handleApply = () => {
    if (onApply) {
      onApply(filters);
    }
    setIsExpanded(false);
  };

  // ✅ Correction : Vérification avant appel
  const handleReset = () => {
    setFilters({
      dateRange: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      },
      status: [],
      type: [],
    });
    if (onReset) {
      onReset();
    }
  };

  // ✅ Correction : toggleStatus correcte
  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status?.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...(prev.status || []), status],
    }));
  };

  const activeFiltersCount = (filters.status?.length || 0);

  return (
    <Card>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isExpanded && (
        <CardContent className="pt-0 pb-4">
          <div className="space-y-4">
            {/* Période */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Du</p>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Au</p>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Statut */}
            {showStatusFilter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <div className="flex flex-wrap gap-2">
                  {['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'EXPIRED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        filters.status?.includes(status)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleApply} size="sm" variant="primary">
                <Search className="w-4 h-4 mr-2" />
                Appliquer
              </Button>
              <Button onClick={handleReset} size="sm" variant="outline">
                <X className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ReportFilters;