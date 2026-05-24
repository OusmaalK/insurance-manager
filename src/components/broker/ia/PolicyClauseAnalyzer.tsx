// src/components/broker/ia/PolicyClauseAnalyzer.tsx
// Analyseur de clauses de contrat IA (Courtier)
// <150 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { policiesApi } from '@/modules/api/policies/policies.api';

// Icônes
import { FileSearch, AlertTriangle, CheckCircle, Scale, TrendingUp, FileText, Download, Eye, Shield, XCircle } from 'lucide-react';

interface Clause {
  id: string;
  text: string;
  type: 'RISK' | 'NEUTRAL' | 'BENEFIT';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  recommendation: string;
}

interface PolicyClauseAnalyzerProps {
  policyId: number;
  policyNumber?: string;
  onAnalysisComplete?: (clauses: Clause[]) => void;
}

export const PolicyClauseAnalyzer = ({ policyId, policyNumber, onAnalysisComplete }: PolicyClauseAnalyzerProps) => {
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const detectedClauses: Clause[] = [
      {
        id: '1',
        text: 'En cas de résiliation anticipée, une pénalité de 15% du montant restant sera due.',
        type: 'RISK',
        severity: 'HIGH',
        explanation: 'Cette clause pénalise lourdement la résiliation anticipée',
        recommendation: 'Négocier la réduction du pourcentage ou la suppression de la pénalité'
      },
      {
        id: '2',
        text: 'La franchise applicable est de 500€ par sinistre.',
        type: 'NEUTRAL',
        severity: 'MEDIUM',
        explanation: 'Franchise standard dans le secteur',
        recommendation: 'Comparer avec les offres concurrentes'
      },
      {
        id: '3',
        text: 'Couverture incluse pour les catastrophes naturelles jusqu\'à 50 000€.',
        type: 'BENEFIT',
        severity: 'LOW',
        explanation: 'Protection supplémentaire appréciable',
        recommendation: 'Ce point est un atout à mettre en avant'
      },
      {
        id: '4',
        text: 'Exclusion de garantie pour les événements climatiques majeurs.',
        type: 'RISK',
        severity: 'HIGH',
        explanation: 'Faille importante dans la couverture',
        recommendation: 'Vérifier la possibilité d\'une extension de garantie'
      }
    ];
    
    setClauses(detectedClauses);
    onAnalysisComplete?.(detectedClauses);
    setIsAnalyzing(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RISK': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'BENEFIT': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Scale className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'Risque élevé';
      case 'MEDIUM': return 'Risque moyen';
      default: return 'Point positif';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'RISK': return 'Clause à risque';
      case 'BENEFIT': return 'Avantage';
      default: return 'Neutre';
    }
  };

  const riskCount = clauses.filter(c => c.type === 'RISK').length;
  const benefitCount = clauses.filter(c => c.type === 'BENEFIT').length;
  const highRiskCount = clauses.filter(c => c.severity === 'HIGH').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-purple-600" />
          Analyseur de clauses IA
          {policyNumber && <span className="text-sm font-normal text-gray-500">- {policyNumber}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload de fichier */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="contract-upload"
          />
          <label htmlFor="contract-upload" className="cursor-pointer">
            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Déposez votre contrat ici ou cliquez pour parcourir</p>
            <p className="text-xs text-gray-400 mt-1">Formats acceptés: PDF, DOCX, TXT</p>
          </label>
          {uploadedFile && (
            <div className="mt-3 p-2 bg-gray-100 rounded-lg">
              <p className="text-sm">📄 {uploadedFile.name}</p>
            </div>
          )}
        </div>

        {/* Bouton analyse */}
        {(uploadedFile || policyId) && clauses.length === 0 && (
          <Button onClick={handleAnalyze} disabled={isAnalyzing} fullWidth>
            {isAnalyzing ? <LoadingSpinner size="sm" /> : <Shield className="w-4 h-4 mr-2" />}
            {isAnalyzing ? 'Analyse IA en cours...' : 'Analyser le contrat avec IA'}
          </Button>
        )}

        {/* Résumé des résultats */}
        {clauses.length > 0 && (
          <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-gray-500">Clauses analysées</p>
              <p className="text-xl font-bold">{clauses.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Points de vigilance</p>
              <p className="text-xl font-bold text-red-600">{riskCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Points positifs</p>
              <p className="text-xl font-bold text-green-600">{benefitCount}</p>
            </div>
          </div>
        )}

        {/* Liste des clauses */}
        {clauses.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Clauses détectées ({clauses.length})</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Exporter
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
                  <Eye className="w-4 h-4 mr-1" />
                  {showDetails ? 'Masquer' : 'Détails'}
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {clauses.map((clause) => (
                <div key={clause.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(clause.type)}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(clause.severity)}`}>
                          {getSeverityLabel(clause.severity)}
                        </span>
                        <span className="text-xs text-gray-400">{getTypeLabel(clause.type)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{clause.text}</p>
                      {showDetails && (
                        <>
                          <p className="text-xs text-gray-500 mt-2">{clause.explanation}</p>
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs font-medium text-blue-800">💡 Recommandation</p>
                            <p className="text-xs text-blue-700 mt-1">{clause.recommendation}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Synthèse IA */}
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <p className="text-sm font-medium text-purple-800">Synthèse IA</p>
              </div>
              <p className="text-sm text-purple-700 mt-1">
                Le contrat présente {riskCount} point(s) d'attention et {benefitCount} avantage(s).
                {highRiskCount > 0 && ' Une vigilance particulière est recommandée sur les clauses à risque élevé.'}
              </p>
            </div>

            {/* Alerte risque élevé */}
            {highRiskCount > 0 && (
              <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Alerte : Clause(s) à risque élevé détectée(s)</p>
                  <p className="text-xs text-red-700 mt-1">
                    Nous vous recommandons de consulter ces clauses avec votre conseiller juridique.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyClauseAnalyzer;