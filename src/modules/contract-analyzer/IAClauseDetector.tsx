// src/modules/contract-analyzer/IAClauseDetector.tsx
// Détection IA des clauses contractuelles
// <160 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

// Icônes
import { FileSearch, AlertTriangle, CheckCircle, Shield, Scale, TrendingUp, FileText, Download, Eye } from 'lucide-react';

interface Clause {
  id: string;
  text: string;
  type: 'RISK' | 'NEUTRAL' | 'BENEFIT';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  recommendation: string;
}

interface IAClauseDetectorProps {
  contractText?: string;
  onAnalysisComplete?: (clauses: Clause[]) => void;
}

export const IAClauseDetector = ({ contractText, onAnalysisComplete }: IAClauseDetectorProps) => {
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-purple-600" />
          Détecteur de clauses IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload */}
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
        {(uploadedFile || contractText) && clauses.length === 0 && (
          <Button onClick={handleAnalyze} disabled={isAnalyzing} fullWidth>
            {isAnalyzing ? <LoadingSpinner size="sm" /> : <Shield className="w-4 h-4 mr-2" />}
            {isAnalyzing ? 'Analyse par IA en cours...' : 'Analyser le contrat avec IA'}
          </Button>
        )}

        {/* Résultats */}
        {clauses.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Clauses détectées ({clauses.length})</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Exporter
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Rapport complet
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {clauses.map((clause) => (
                <div key={clause.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(clause.type)}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(clause.severity)}`}>
                          {clause.severity === 'HIGH' ? 'Risque élevé' : clause.severity === 'MEDIUM' ? 'Risque moyen' : 'Point positif'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{clause.text}</p>
                      <p className="text-xs text-gray-500 mt-2">{clause.explanation}</p>
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-blue-800">💡 Recommandation</p>
                        <p className="text-xs text-blue-700 mt-1">{clause.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-green-800">Synthèse IA</p>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Le contrat présente {clauses.filter(c => c.type === 'RISK').length} points d'attention et {clauses.filter(c => c.type === 'BENEFIT').length} avantages.
                {clauses.some(c => c.severity === 'HIGH') && ' Une vigilance particulière est recommandée sur les clauses à risque élevé.'}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IAClauseDetector;