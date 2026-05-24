// src/components/admin/reports/ReportForm.tsx (version avec store)
'use client';

import { useState } from 'react';
import { Brain, Save, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useReportFormStore } from '@/stores/reportFormStore';
import { REPORT_TYPES, REPORT_FORMATS } from '@/types/report.types';

export const ReportForm = () => {
  const { onSubmit, onCancel } = useReportFormStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'STANDARD',
    format: 'PDF',
    dateRange: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Titre requis' });
      return;
    }
    if (onSubmit) {
      setIsLoading(true);
      await onSubmit(formData);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... reste du JSX identique ... */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleCancel}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Génération...' : 'Générer le rapport'}
        </Button>
      </div>
    </form>
  );
};