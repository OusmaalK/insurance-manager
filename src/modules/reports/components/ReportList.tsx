// src/modules/reports/components/ReportList.tsx
// Version corrigée

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { reportsApi } from '@/modules/api/reports/reports.api';
import { Report } from '@/types/report.types';

// Icônes
import { FileText, Download, Send, Eye, Trash2, Calendar, ChevronRight, RefreshCw } from 'lucide-react';

interface ReportListProps {
  onReportClick?: (report: Report) => void;
  onExport?: (id: number, format: 'pdf' | 'excel') => void;
  limit?: number;
}

export const ReportList = ({ onReportClick, onExport, limit = 10 }: ReportListProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadReports();
  }, [page]);

  const loadReports = async () => {
    setIsLoading(true);
    const response = await reportsApi.list({ page, limit });
    if (response.success && response.data) {
      setReports(response.data.data);
    }
    setIsLoading(false);
  };

  // ✅ Fonction d'export corrigée
  const handleExport = async (id: number, format: 'pdf' | 'excel') => {
    if (onExport) {
      onExport(id, format);
    } else {
      try {
        const blob = await reportsApi.export(id, format);
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `report_${id}.${format}`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || styles.completed;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Chargement des rapports..." />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun rapport généré</p>
          <p className="text-sm text-gray-400">Utilisez le formulaire pour créer votre premier rapport</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        // ✅ Correction : Div enveloppant avec onClick au lieu de le mettre sur Card
        <div
          key={report.id}
          className="cursor-pointer"
          onClick={() => onReportClick?.(report)}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{report.type}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.generated_at).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">{report.format}</span>
                    <span className="text-xs text-gray-500">{report.period}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Généré en {report.generation_time}ms
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleExport(report.id, 'pdf'); 
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleExport(report.id, 'excel'); 
                    }}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onReportClick?.(report); 
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ReportList;