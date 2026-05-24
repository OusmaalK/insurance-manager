// src/components/admin/policies/PolicyClauseExtractor.tsx
'use client';

import { useState } from 'react';
import { 
  FileText, AlertCircle, CheckCircle, FileUp, Scan, 
  Copy, Download, Trash2, X, ChevronDown, ChevronUp,
  Shield, AlertTriangle, Info
} from 'lucide-react';
import { usePolicyAI } from '@/hooks/usePolicyAI';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

interface PolicyClauseExtractorProps {
  policyId: number;
  onExtracted?: (clauses: any[]) => void;
}

export function PolicyClauseExtractor({ policyId, onExtracted }: PolicyClauseExtractorProps) {
  const { analyzeClauses, isLoading } = usePolicyAI();
  const [isOpen, setIsOpen] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [clauses, setClauses] = useState<any[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [expandedClause, setExpandedClause] = useState<number | null>(null);

  const handleExtract = async () => {
    const result = await analyzeClauses(policyId, documentText);
    if (result) {
      setAnalysisResult(result);
      setClauses(result.extracted_clauses || []);
      onExtracted?.(result.extracted_clauses);
    }
  };

  const handleReset = () => {
    setDocumentText('');
    setClauses([]);
    setAnalysisResult(null);
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'MEDIUM': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">Risque élevé</span>;
      case 'MEDIUM': return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">Risque modéré</span>;
      default: return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Risque faible</span>;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
      >
        <Scan className="w-4 h-4" />
        Analyser les clauses IA
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Analyse IA des clauses" size="lg">
        <div className="space-y-4">
          {/* Zone de saisie du texte */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">Collez le texte du contrat ou importez un fichier</p>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Collez le texte du contrat ici..."
              className="w-full h-48 p-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-3 mt-3 justify-center">
              <Button onClick={handleExtract} disabled={isLoading || !documentText.trim()}>
                {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Scan className="w-4 h-4 mr-2" />}
                Extraire les clauses
              </Button>
              {clauses.length > 0 && (
                <Button variant="outline" onClick={handleReset}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>

          {/* Résumé de l'analyse */}
          {analysisResult?.risk_summary && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Résumé de l'analyse</p>
                  <p className="text-sm text-blue-600">{analysisResult.risk_summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Liste des clauses extraites */}
          {clauses.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Clauses détectées ({clauses.length})</h3>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600" title="Copier tout">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600" title="Exporter">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {clauses.map((clause, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-lg border-l-4 overflow-hidden transition-all ${
                    clause.risk_level === 'HIGH' ? 'border-red-500 bg-red-50' :
                    clause.risk_level === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}
                >
                  <button
                    onClick={() => setExpandedClause(expandedClause === idx ? null : idx)}
                    className="w-full p-3 text-left flex items-start justify-between"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {getRiskIcon(clause.risk_level)}
                      <div>
                        <p className="font-medium text-gray-900">{clause.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{clause.content}</p>
                      </div>
                    </div>
                    {expandedClause === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  
                  {expandedClause === idx && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="p-3 bg-white rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          {getRiskBadge(clause.risk_level)}
                          <span className="text-xs text-gray-400">Clause #{idx + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{clause.content}</p>
                        {clause.explanation && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">🔍 Explication IA :</span> {clause.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Recommandations globales */}
          {analysisResult?.recommendations && analysisResult.recommendations.length > 0 && (
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-700 flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                Recommandations IA
              </p>
              <ul className="space-y-1">
                {analysisResult.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="text-sm text-purple-600 flex items-start gap-2">
                    <span>•</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Message si aucune clause */}
          {clauses.length === 0 && !isLoading && documentText.trim() && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Aucune clause détectée</p>
              <p className="text-xs text-gray-400">Essayez de coller un texte de contrat plus complet</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}