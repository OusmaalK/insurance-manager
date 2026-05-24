// src/components/admin/audit/AuditExportButton.tsx
'use client';

import { Download, FileText, FileSpreadsheet, FileCode, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useAuditExportStore } from '@/stores/auditExportStore';
import { useAuditExport } from '@/hooks/useAuditExport';

export const AuditExportButton = () => {
  const { isExporting, exportSuccess, isOpen, toggleDropdown, closeDropdown, resetExport } = useAuditExportStore();
  const { exportLogs } = useAuditExport();

  const formats = [
    { key: 'csv', label: 'CSV', icon: FileSpreadsheet, color: 'text-green-600', description: 'Tableur' },
    { key: 'json', label: 'JSON', icon: FileCode, color: 'text-blue-600', description: 'Développeurs' },
    { key: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-600', description: 'Document' },
  ];

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    await exportLogs(format);
    closeDropdown();
    setTimeout(() => resetExport(), 3000);
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        onClick={toggleDropdown}
        disabled={isExporting}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Export...' : 'Exporter'}
      </Button>
      
      {exportSuccess && (
        <div className="absolute top-full mt-2 right-0 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap z-10">
          <CheckCircle className="w-3 h-3" />
          Export {exportSuccess} réussi
        </div>
      )}
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={closeDropdown} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 overflow-hidden">
            <div className="p-1">
              {formats.map((format) => (
                <button
                  key={format.key}
                  onClick={() => handleExport(format.key as any)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <format.icon className={`w-4 h-4 ${format.color}`} />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{format.label}</p>
                    <p className="text-xs text-gray-400">{format.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditExportButton;