// src/lib/api/export.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const exportReportToBlob = async (reportId: number, format: 'pdf' | 'excel'): Promise<Blob> => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/export?format=${format}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`);
  }

  return response.blob();
};

export const downloadReport = async (reportId: number, format: 'pdf' | 'excel', filename?: string): Promise<void> => {
  const blob = await exportReportToBlob(reportId, format);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `report_${reportId}_${new Date().toISOString().split('T')[0]}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};