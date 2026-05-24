// src/modules/reports/shared/ReportTemplate.tsx
// Template de base pour les rapports
// <110 lignes

'use client';

import React from 'react';
import { Report } from '@/types/report.types';

// Icônes
import { FileText, Calendar, User, Building2, TrendingUp, Shield } from 'lucide-react';

interface ReportTemplateProps {
  report: Report;
  children: React.ReactNode;
  onExport?: () => void;
  onPrint?: () => void;
}

export const ReportTemplate = ({ report, children, onExport, onPrint }: ReportTemplateProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* En-tête */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{report.type}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(report.generated_at).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 uppercase">{report.format}</span>
                <span className="text-sm text-gray-500">{report.period}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {onExport && (
              <button
                onClick={onExport}
                className="px-3 py-1.5 text-sm bg-white border rounded-lg hover:bg-gray-50"
              >
                Exporter
              </button>
            )}
            {onPrint && (
              <button
                onClick={onPrint}
                className="px-3 py-1.5 text-sm bg-white border rounded-lg hover:bg-gray-50"
              >
                Imprimer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="px-6 py-4 bg-gray-50 border-b grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Généré par</p>
            <p className="text-sm font-medium">Utilisateur #{report.user_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Entreprise</p>
            <p className="text-sm font-medium">{report.company_id ? `#${report.company_id}` : 'Toutes'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Temps génération</p>
            <p className="text-sm font-medium">{report.generation_time}ms</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Statut</p>
            <p className="text-sm font-medium capitalize">{report.status}</p>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {children}
      </div>

      {/* Pied de page */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <p className="text-xs text-gray-400 text-center">
          Rapport généré automatiquement par Insurance Broker Platform
        </p>
      </div>
    </div>
  );
};

export default ReportTemplate;