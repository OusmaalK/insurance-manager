// src/components/admin/audit/AuditLogsTable.tsx
'use client';

import { Eye } from 'lucide-react';
import { useAuditModalStore } from '@/stores/auditModalStore';
import { 
  getModuleLabel, getModuleColor,
  getSeverityLabel, getSeverityColor,
  getStatusLabel, getStatusColor,
  formatDuration, formatDateTime
} from '@/types/audit.types';

interface AuditLogsTableProps {
  logs: any[];
  isLoading: boolean;
  onRowClick?: (id: number) => void;  // ✅ Typer correctement
}

export const AuditLogsTable = ({ logs, isLoading, onRowClick }: AuditLogsTableProps) => {
  const { openModal } = useAuditModalStore();

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-xl"></div>;
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Aucun log trouvé</p>
      </div>
    );
  }

  const handleRowClick = (log: any) => {
    if (onRowClick) {
      onRowClick(log.id);
    } else {
      openModal(log);
    }
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Sévérité</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Durée</th>
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr 
                key={log.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(log)}
              >
                <td className="px-4 py-3 text-sm">{formatDateTime(log.timestamp)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{log.details}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getModuleColor(log.module)}`}>
                    {getModuleLabel(log.module)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(log.severity)}`}>
                    {getSeverityLabel(log.severity)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(log.status)}`}>
                    {getStatusLabel(log.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{formatDuration(log.duration)}</td>
                <td className="px-4 py-3 text-sm">{log.userName}</td>
                <td className="px-4 py-3">
                  <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogsTable;