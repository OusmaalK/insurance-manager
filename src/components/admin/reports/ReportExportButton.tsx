// src/components/admin/reports/ReportExportButton.tsx
'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileCode } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useReports } from '@/hooks/useReports';

interface ReportExportButtonProps {
  reportId: number;
}

export const ReportExportButton = ({ reportId }: ReportExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { exportReport } = useReports();

  const handleExport = async (format: 'PDF' | 'EXCEL' | 'CSV') => {
    setIsExporting(true);
    await exportReport(reportId, format);
    setIsExporting(false);
    setIsOpen(false);
  };

  const formats = [
    { key: 'PDF', label: 'PDF', icon: FileText, color: 'text-red-600' },
    { key: 'EXCEL', label: 'Excel', icon: FileSpreadsheet, color: 'text-green-600' },
    { key: 'CSV', label: 'CSV', icon: FileCode, color: 'text-blue-600' },
  ];

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Export...' : 'Exporter'}
      </Button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border z-20">
            {formats.map((format) => (
              <button
                key={format.key}
                onClick={() => handleExport(format.key as any)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                <format.icon className={`w-4 h-4 ${format.color}`} />
                {format.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};