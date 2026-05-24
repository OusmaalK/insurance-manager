// src/modules/reports/components/ReportExporter.tsx
// Exportateur de rapports
// <100 lignes

'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { reportsApi } from '@/modules/api/reports/reports.api';

// Icônes
import { Download, FileText, FileSpreadsheet, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface ReportExporterProps {
  reportId: number;
  onExportComplete?: () => void;
}

export const ReportExporter = ({ reportId, onExportComplete }: ReportExporterProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    setError(null);
    
    try {
      const blob = await reportsApi.export(reportId, format);
      if (blob) {
        const url = window.URL.createObjectURL(blob as any);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${reportId}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        onExportComplete?.();
      }
    } catch (err) {
      setError("Erreur lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) return;
    
    setIsSending(true);
    setError(null);
    
    try {
      const response = await reportsApi.send(reportId, [email]);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        onExportComplete?.();
      } else {
        setError(response.error || "Erreur lors de l'envoi");
      }
    } catch (err) {
      setError("Erreur lors de l'envoi");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <p className="text-sm text-green-600">Opération réussie !</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={() => handleExport('pdf')} disabled={isExporting} variant="outline" className="flex-1">
          {isExporting ? <LoadingSpinner size="sm" /> : <FileText className="w-4 h-4 mr-2" />}
          Exporter PDF
        </Button>
        <Button onClick={() => handleExport('excel')} disabled={isExporting} variant="outline" className="flex-1">
          {isExporting ? <LoadingSpinner size="sm" /> : <FileSpreadsheet className="w-4 h-4 mr-2" />}
          Exporter Excel
        </Button>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Envoyer par email</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="destinataire@exemple.fr"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleSendEmail} disabled={isSending || !email} variant="primary">
            {isSending ? <LoadingSpinner size="sm" /> : <Mail className="w-4 h-4 mr-2" />}
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportExporter;