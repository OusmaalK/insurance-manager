// src/components/admin/reports/ReportsList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Search, Filter, Download, Trash2, 
  Eye, Brain, Calendar, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useReports } from '@/hooks/useReports';
import { 
  REPORT_TYPES, REPORT_STATUS, REPORT_FORMATS,
  getReportTypeLabel, getReportTypeColor,
  getReportStatusLabel, getReportStatusColor,
  formatDateTime, formatFileSize
} from '@/types/report.types';

interface ReportsListProps {
  limit?: number;
  showActions?: boolean;
  onReportClick?: (id: number) => void;
}

export const ReportsList = ({ limit = 10, showActions = true, onReportClick }: ReportsListProps) => {
  const router = useRouter();
  const { reports, total, isLoading, fetchReports, deleteReport, exportReport } = useReports({ autoFetch: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState<number | null>(null);

  // Dans le useEffect
useEffect(() => {
    const load = async () => {
      // ✅ Conversion inline
      const validType = (typeFilter === 'AI' ? 'AI' : typeFilter === 'STANDARD' ? 'STANDARD' : undefined) as any;
      const validStatus = (statusFilter === 'COMPLETED' ? 'COMPLETED' : 
                           statusFilter === 'FAILED' ? 'FAILED' : 
                           statusFilter === 'GENERATING' ? 'GENERATING' : undefined) as any;
      
      await fetchReports({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        type: validType,
        status: validStatus,
      });
    };
    load();
  }, [currentPage, searchTerm, typeFilter, statusFilter, limit, fetchReports]);

  const handleExport = async (id: number, format: 'PDF' | 'EXCEL' | 'CSV', e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExporting(id);
    await exportReport(id, format);
    setIsExporting(null);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Confirmer la suppression ?')) {
      await deleteReport(id);
      await fetchReports({ page: currentPage, limit });
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Rapports</CardTitle>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => router.push('/admin/reports/new')}>
              <FileText className="w-4 h-4 mr-2" />
              Nouveau rapport
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Tous types</option>
            {Object.entries(REPORT_TYPES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Tous statuts</option>
            {Object.entries(REPORT_STATUS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setTypeFilter(''); setStatusFilter(''); }}>
            Réinitialiser
          </Button>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50 border-b">
      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <th className="px-4 py-3">Titre</th>
        <th className="px-4 py-3">Type</th>
        <th className="px-4 py-3">Format</th>
        <th className="px-4 py-3">Statut</th>
        <th className="px-4 py-3">Date</th>
        <th className="px-4 py-3">Taille</th>
        {showActions && <th className="px-4 py-3">Actions</th>}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {reports.map((report) => (
        <tr
          key={report.id}
          className="hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onReportClick ? onReportClick(report.id) : router.push(`/admin/reports/${report.id}`)}
        >
          <td className="px-4 py-3">
            <p className="font-medium text-gray-900">{report.title}</p>
            <p className="text-xs text-gray-500 line-clamp-1">{report.description}</p>
          </td>
          <td className="px-4 py-3">
            <span className={`text-xs px-2 py-1 rounded-full ${getReportTypeColor(report.type)}`}>
              {getReportTypeLabel(report.type)}
            </span>
          </td>
          <td className="px-4 py-3 text-sm">{report.format}</td>
          <td className="px-4 py-3">
            <span className={`text-xs px-2 py-1 rounded-full ${getReportStatusColor(report.status)}`}>
              {getReportStatusLabel(report.status)}
            </span>
          </td>
          <td className="px-4 py-3 text-sm">{formatDateTime(report.generatedAt)}</td>
          <td className="px-4 py-3 text-sm">{formatFileSize(report.metadata?.size || 0)}</td>
          {showActions && (
            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleExport(report.id, 'PDF', e)}
                  disabled={isExporting === report.id}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Exporter PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(report.id, e)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          )}
        </tr>
      ))}
      {reports.length === 0 && (
        <tr>
          <td colSpan={showActions ? 7 : 6} className="text-center py-8 text-gray-500">
            Aucun rapport trouvé
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-3 border-t">
            <span className="text-sm text-gray-500">{total} rapport(s)</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 text-sm">Page {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};