// src/app/admin/audit/[id]/page.tsx
// Page détail d'un log d'audit
'use client';
import { Activity } from 'lucide-react';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, Download, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { useAudit } from '@/hooks/useAudit';
import { 
  getModuleLabel, getModuleColor,
  getSeverityLabel, getSeverityColor,
  getStatusLabel, getStatusColor,
  formatDuration, formatDateTime
} from '@/types/audit.types';

export default function AuditDetailPage() {
  const params = useParams();
  const router = useRouter();
  const logId = parseInt(params.id as string);
  const { getLogById, isLoading } = useAudit();
  const [log, setLog] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getLogById(logId);
      setLog(data);
    };
    load();
  }, [logId]);

  const handleCopy = () => {
    if (log) {
      navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    }
  };

  if (isLoading || !log) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Chargement..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/audit" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Détail du log</h1>
          <p className="text-sm text-gray-500">ID: #{log.id}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copier
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Action</span>
              <span className="font-medium">{log.action}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Module</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getModuleColor(log.module)}`}>
                {getModuleLabel(log.module)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Sévérité</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(log.severity)}`}>
                {getSeverityLabel(log.severity)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Statut</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(log.status)}`}>
                {getStatusLabel(log.status)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Date</span>
              <span>{formatDateTime(log.timestamp)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Durée</span>
              <span>{formatDuration(log.duration)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateur & Contexte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Utilisateur</span>
              <span className="font-medium">{log.userName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Rôle</span>
              <span>{log.userRole}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">IP Address</span>
              <span className="font-mono text-sm">{log.ipAddress}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">User Agent</span>
              <span className="text-sm truncate max-w-[200px]">{log.userAgent}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails */}
      <Card>
        <CardHeader>
          <CardTitle>Détails</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{log.details}</p>
        </CardContent>
      </Card>

      {/* Métadonnées IA */}
      {log.metadata && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Métadonnées IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {log.metadata.aiConfidence && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Confiance IA</span>
                <span>{log.metadata.aiConfidence}%</span>
              </div>
            )}
            {log.metadata.aiModel && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Modèle IA</span>
                <span>{log.metadata.aiModel}</span>
              </div>
            )}
            {log.metadata.cost && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Coût</span>
                <span>{log.metadata.cost}€</span>
              </div>
            )}
            {log.metadata.tokens && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Tokens</span>
                <span>{log.metadata.tokens}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Badge IA */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Log tracé • Audit complet • Conforme RGPD</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}