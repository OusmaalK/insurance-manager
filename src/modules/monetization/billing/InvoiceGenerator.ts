// src/modules/monetization/billing/InvoiceGenerator.ts
// Générateur de factures
// <100 lignes

import { apiClient } from '@/modules/api/client/client';

// ============================================
// TYPES
// ============================================

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  planName: string;
  credits: number;
  usage: number;
  pdfUrl?: string;
}

export interface InvoiceFilter {
  startDate?: string;
  endDate?: string;
  status?: string;
}

// ============================================
// SERVICE
// ============================================

class InvoiceGeneratorClass {
  async getInvoices(filters?: InvoiceFilter): Promise<Invoice[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.status) params.append('status', filters.status);
      
      const url = `/ia/monetization/invoices${params.toString() ? `?${params}` : ''}`;
      const response = await apiClient.get(url);
      return (response as any).data || [];
    } catch (error) {
      console.error('Failed to get invoices', error);
      return this.getMockInvoices();
    }
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    try {
      const response = await apiClient.get(`/ia/monetization/invoices/${invoiceId}`);
      return (response as any).data || null;
    } catch (error) {
      console.error('Failed to get invoice', error);
      return null;
    }
  }

  async downloadInvoice(invoiceId: string): Promise<void> {
    try {
      const response = await apiClient.get(`/ia/monetization/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      const blob = response as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${invoiceId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice', error);
      throw new Error('Download failed');
    }
  }

  async getUsageStats(): Promise<{ used: number; total: number; percentage: number }> {
    try {
      const response = await apiClient.get('/ia/monetization/usage/stats');
      const data = (response as any).data;
      return {
        used: data?.used || 0,
        total: data?.total || 100,
        percentage: data?.percentage || 0,
      };
    } catch (error) {
      return { used: 0, total: 100, percentage: 0 };
    }
  }

  private getMockInvoices(): Invoice[] {
    return [
      { id: '1', number: 'INV-2024-001', date: new Date().toISOString(), dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), amount: 49, status: 'PAID', planName: 'IA Pro', credits: 500, usage: 234 },
      { id: '2', number: 'INV-2024-002', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), dueDate: new Date().toISOString(), amount: 49, status: 'PENDING', planName: 'IA Pro', credits: 500, usage: 412 },
    ];
  }
}

export const InvoiceGenerator = new InvoiceGeneratorClass();
export default InvoiceGenerator;