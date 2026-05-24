// src/components/admin/reports/ReportCard.tsx
'use client';

import { FileText, Brain, Download, Eye, Calendar, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useReportStore } from '@/stores/reportStore';
import { 
  getReportTypeLabel, 
  getReportTypeColor, 
  getReportStatusLabel,
  getReportStatusColor,
  formatDateTime,
  formatFileSize
} from '@/types/report.types';

interface ReportCardProps {
  report: {
    id: number;
    title: string;
    description?: string;
    type: string;
    status: string;
    format: string;
    generatedAt: string;
    metadata?: { size?: number };
  };
}

export const ReportCard = ({ report }: ReportCardProps) => {
  const { viewReport, exportReport } = useReportStore();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {report.type === 'AI' ? (
            <Brain className="w-5 h-5 text-purple-500" />
          ) : (
            <FileText className="w-5 h-5 text-blue-500" />
          )}
          <h3 className="font-semibold text-gray-900 line-clamp-1">{report.title}</h3>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${getReportTypeColor(report.type)}`}>
          {getReportTypeLabel(report.type)}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {report.description || 'Aucune description'}
      </p>

      {/* Métadonnées */}
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDateTime(report.generatedAt)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {report.metadata?.size ? formatFileSize(report.metadata.size) : 'N/A'}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${getReportStatusColor(report.status)}`}>
          {getReportStatusLabel(report.status)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => viewReport(report.id)} 
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-1" />
          Voir
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => exportReport(report.id)} 
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
};