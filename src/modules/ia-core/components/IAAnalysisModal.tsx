// src/modules/ia-core/components/IAAnalysisModal.tsx
// Modal d'analyse IA - Version sans props fonctions problématiques
// <180 lignes

'use client';

import React, { useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { IAScoreBadge } from './IAScoreBadge';
import { useModalStore } from '@/stores/modalStore';

// Icônes
import { Brain, Shield, TrendingUp, AlertTriangle, CheckCircle, Sparkles, X } from 'lucide-react';

interface IAAnalysisModalProps {
  modalId: string;
  title: string;
  type: 'RISK' | 'FRAUD' | 'RENEWAL';
  onRefresh?: () => void;
}

export const IAAnalysisModal = ({ modalId, title, type, onRefresh }: IAAnalysisModalProps) => {
  const { modals, closeModal, getModalData } = useModalStore();
  const isOpen = modals[modalId] || false;
  const data = getModalData(modalId);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal(modalId);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, modalId, closeModal]);

  const getTypeIcon = () => {
    switch (type) {
      case 'RISK': return <Shield className="w-5 h-5 text-orange-500" />;
      case 'FRAUD': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'RENEWAL': return <TrendingUp className="w-5 h-5 text-green-500" />;
      default: return <Brain className="w-5 h-5 text-purple-500" />;
    }
  };

  const getScore = (): number => {
    if (!data) return 0;
    switch (type) {
      case 'RISK': return data.risk_score || data.score || 0;
      case 'FRAUD': return data.fraud_score || data.score || 0;
      case 'RENEWAL': return data.renewal_probability || data.probability || 0;
      default: return 0;
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    if (onRefresh) {
      await onRefresh();
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 mt-4">Analyse en cours...</p>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune analyse disponible</p>
          {onRefresh && (
            <Button onClick={handleRefresh} variant="primary" className="mt-4">
              Lancer l'analyse
            </Button>
          )}
        </div>
      );
    }

    const score = getScore();

    return (
      <div className="space-y-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-center mb-2">
            <IAScoreBadge score={score} type={type} size="lg" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Analyse effectuée le {new Date(data.analyzed_at || data.created_at || Date.now()).toLocaleString()}
          </p>
        </div>

        {(data.factors || data.indicators) && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {type === 'FRAUD' ? 'Indicateurs détectés' : 'Facteurs analysés'}
            </h4>
            <div className="space-y-2">
              {(data.factors || data.indicators || []).map((factor: any, idx: number) => (
                <div key={idx} className="p-2 border rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{factor.name}</span>
                    <span className={factor.impact >= 70 ? 'text-red-600' : factor.impact >= 40 ? 'text-orange-600' : 'text-green-600'}>
                      {factor.impact || factor.score}%
                    </span>
                  </div>
                  {factor.description && <p className="text-xs text-gray-500 mt-1">{factor.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.recommendations && data.recommendations.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Recommandations IA
            </h4>
            <ul className="space-y-1">
              {data.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.confidence !== undefined && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Niveau de confiance</span>
              <span className="font-medium">{(data.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 rounded-full h-2" style={{ width: `${data.confidence * 100}%` }} />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => closeModal(modalId)} />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              {getTypeIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button onClick={() => closeModal(modalId)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              {getTypeIcon()}
              <span className="text-sm text-gray-500">Analyse IA</span>
            </div>
            {renderContent()}
          </div>
          <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
            <Button variant="outline" onClick={() => closeModal(modalId)}>
              Fermer
            </Button>
            {onRefresh && (
              <Button variant="primary" onClick={handleRefresh}>
                Actualiser
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IAAnalysisModal;