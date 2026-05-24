// src/hooks/useAuditExport.ts
'use client';

import { useCallback } from 'react';
import { useAuditExportStore } from '@/stores/auditExportStore';
import { useAuditFilterStore } from '@/stores/auditFilterStore';
import { auditApi } from '@/modules/api/audit/audit.api';
import { AuditFilters } from '@/types/audit.types';

export const useAuditExport = () => {
  const { startExport, finishExport } = useAuditExportStore();
  const { filters } = useAuditFilterStore();

  const exportLogs = useCallback(async (format: 'csv' | 'json' | 'pdf') => {
    startExport();
    
    try {
      // Nettoyer les filtres pour l'API
      const cleanFilters: AuditFilters = {
        module: filters.module || undefined,
        severity: filters.severity,
        status: filters.status,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        search: filters.search || undefined,
        entityType: filters.entityType,
        userId: filters.userId,
        minDuration: filters.minDuration,
        maxDuration: filters.maxDuration,
        hasError: filters.hasError,
      };
      
      await auditApi.exportLogs(format, cleanFilters);
      finishExport(format);
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      finishExport(format);
      return false;
    }
  }, [filters, startExport, finishExport]);

  return { exportLogs };
};

export default useAuditExport;