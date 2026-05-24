// src/modules/reports/standard/StandardReportExporter.ts
// Exportateur de rapports standards
// <90 lignes

import { reportsApi } from '@/modules/api/reports/reports.api';

// ============================================
// TYPES
// ============================================

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts?: boolean;
  includeTables?: boolean;
  pageSize?: 'A4' | 'A3' | 'LETTER';
  orientation?: 'portrait' | 'landscape';
}

export interface ExportResult {
  success: boolean;
  blob?: Blob;
  filename?: string;
  error?: string;
}

// ============================================
// EXPORTEUR
// ============================================

export class StandardReportExporter {
  static async exportReport(reportId: number, format: 'pdf' | 'excel'): Promise<ExportResult> {
    try {
      const blob = await reportsApi.export(reportId, format);
      if (blob) {
        const filename = `report_${reportId}_${new Date().toISOString().split('T')[0]}.${format}`;
        return { success: true, blob, filename };
      }
      return { success: false, error: 'No data received' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Export failed' };
    }
  }

  static async downloadReport(reportId: number, format: 'pdf' | 'excel'): Promise<void> {
    const result = await this.exportReport(reportId, format);
    if (result.success && result.blob && result.filename) {
      const url = window.URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Download failed:', result.error);
      throw new Error(result.error || 'Download failed');
    }
  }

  static async exportToCSV(data: any[], filename: string): Promise<void> {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async printReport(reportId: number): Promise<void> {
    try {
      const blob = await reportsApi.export(reportId, 'pdf');
      if (blob) {
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.print();
        }
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Print failed:', error);
      throw error;
    }
  }
}

export default StandardReportExporter;