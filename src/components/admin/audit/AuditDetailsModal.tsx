// src/components/admin/audit/AuditDetailsModal.tsx
'use client';

import { X, Copy, Download, Brain, Clock, User, Server, Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { 
  getModuleLabel, getModuleColor,
  getSeverityLabel, getSeverityColor,
  getStatusLabel, getStatusColor,
  formatDuration, formatDateTime
} from '@/types/audit.types';
import { useAuditModalStore } from '@/stores/auditModalStore';

export const AuditDetailsModal = () => {
  const { isOpen, log, closeModal } = useAuditModalStore();

  if (!isOpen || !log) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
  };

  const handleClose = () => {
    closeModal();
  };

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
      </div>
      <div className="font-medium text-gray-900">{value || 'Non renseigné'}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Détail du log</h2>
              <p className="text-sm text-gray-500">ID: #{log.id}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getModuleColor(log.module)}`}>
              {getModuleLabel(log.module)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(log.severity)}`}>
              {getSeverityLabel(log.severity)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(log.status)}`}>
              {getStatusLabel(log.status)}
            </span>
          </div>

          {/* Informations générales */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Informations générales</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <InfoRow label="Action" value={log.action} icon={Activity} />
              <InfoRow label="Détails" value={log.details} />
              <InfoRow label="Date" value={formatDateTime(log.timestamp)} icon={Clock} />
              <InfoRow label="Durée" value={formatDuration(log.duration)} />
            </div>
          </div>

          {/* Utilisateur */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Utilisateur</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <InfoRow label="Nom" value={log.userName} icon={User} />
              <InfoRow label="Rôle" value={log.userRole} />
              <InfoRow label="IP Address" value={log.ipAddress} icon={Server} />
              <InfoRow label="User Agent" value={log.userAgent} />
            </div>
          </div>

          {/* Métadonnées IA */}
          {log.metadata && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                Métadonnées IA
              </h3>
              <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                {log.metadata.aiConfidence && (
                  <InfoRow label="Confiance IA" value={`${log.metadata.aiConfidence}%`} />
                )}
                {log.metadata.aiModel && (
                  <InfoRow label="Modèle IA" value={log.metadata.aiModel} />
                )}
                {log.metadata.cost && (
                  <InfoRow label="Coût" value={`${log.metadata.cost}€`} />
                )}
                {log.metadata.tokens && (
                  <InfoRow label="Tokens" value={log.metadata.tokens} />
                )}
                {log.metadata.success !== undefined && (
                  <InfoRow 
                    label="Statut" 
                    value={log.metadata.success ? 
                      <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Succès</span> : 
                      <span className="flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4" /> Échec</span>
                    } 
                  />
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailsModal;