// src/modules/contract-analyzer/ContractComparison.tsx
// Comparaison de contrats
// <150 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

// Icônes
import { GitCompare, CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown, Minus, ArrowLeftRight } from 'lucide-react';

interface Contract {
  id: number;
  name: string;
  insurer: string;
  premium: number;
  coverage: number;
  deductible: number;
  benefits: string[];
  exclusions: string[];
}

interface ComparisonResult {
  field: string;
  contract1Value: any;
  contract2Value: any;
  winner: 'CONTRACT1' | 'CONTRACT2' | 'TIE';
  recommendation: string;
}

interface ContractComparisonProps {
  contract1: Contract;
  contract2: Contract;
  onSelectWinner?: (winnerId: number) => void;
}

export const ContractComparison = ({ contract1, contract2, onSelectWinner }: ContractComparisonProps) => {
  const [isComparing, setIsComparing] = useState(false);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [winner, setWinner] = useState<number | null>(null);

  const handleCompare = async () => {
    setIsComparing(true);
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const comparisonResults: ComparisonResult[] = [
      {
        field: 'Prime annuelle',
        contract1Value: `${contract1.premium.toLocaleString()} €`,
        contract2Value: `${contract2.premium.toLocaleString()} €`,
        winner: contract1.premium < contract2.premium ? 'CONTRACT1' : contract1.premium > contract2.premium ? 'CONTRACT2' : 'TIE',
        recommendation: contract1.premium < contract2.premium 
          ? 'Le contrat 1 est plus économique' 
          : contract1.premium > contract2.premium 
          ? 'Le contrat 2 est plus économique' 
          : 'Les primes sont équivalentes'
      },
      {
        field: 'Couverture maximale',
        contract1Value: `${contract1.coverage.toLocaleString()} €`,
        contract2Value: `${contract2.coverage.toLocaleString()} €`,
        winner: contract1.coverage > contract2.coverage ? 'CONTRACT1' : contract1.coverage < contract2.coverage ? 'CONTRACT2' : 'TIE',
        recommendation: contract1.coverage > contract2.coverage 
          ? 'Le contrat 1 offre une meilleure couverture' 
          : contract1.coverage < contract2.coverage 
          ? 'Le contrat 2 offre une meilleure couverture' 
          : 'Couvertures équivalentes'
      },
      {
        field: 'Franchise',
        contract1Value: `${contract1.deductible.toLocaleString()} €`,
        contract2Value: `${contract2.deductible.toLocaleString()} €`,
        winner: contract1.deductible < contract2.deductible ? 'CONTRACT1' : contract1.deductible > contract2.deductible ? 'CONTRACT2' : 'TIE',
        recommendation: contract1.deductible < contract2.deductible 
          ? 'Le contrat 1 a une franchise plus avantageuse' 
          : contract1.deductible > contract2.deductible 
          ? 'Le contrat 2 a une franchise plus avantageuse' 
          : 'Franchises équivalentes'
      },
      {
        field: 'Nombre d\'avantages',
        contract1Value: contract1.benefits.length,
        contract2Value: contract2.benefits.length,
        winner: contract1.benefits.length > contract2.benefits.length ? 'CONTRACT1' : contract1.benefits.length < contract2.benefits.length ? 'CONTRACT2' : 'TIE',
        recommendation: 'Comparez les avantages spécifiques selon vos besoins'
      },
    ];
    
    setResults(comparisonResults);
    
    // Calcul du gagnant global
    const contract1Wins = comparisonResults.filter(r => r.winner === 'CONTRACT1').length;
    const contract2Wins = comparisonResults.filter(r => r.winner === 'CONTRACT2').length;
    const finalWinner = contract1Wins > contract2Wins ? contract1.id : contract2Wins > contract1Wins ? contract2.id : null;
    setWinner(finalWinner);
    
    setIsComparing(false);
  };

  const getWinnerIcon = (winner: string, field: string, value1: any, value2: any) => {
    if (winner === 'CONTRACT1') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (winner === 'CONTRACT2') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* En-tête de comparaison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg">{contract1.name}</h3>
            <p className="text-sm text-gray-500">{contract1.insurer}</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{contract1.premium.toLocaleString()} €</p>
            <p className="text-xs text-gray-500">/ an</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg">{contract2.name}</h3>
            <p className="text-sm text-gray-500">{contract2.insurer}</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{contract2.premium.toLocaleString()} €</p>
            <p className="text-xs text-gray-500">/ an</p>
          </CardContent>
        </Card>
      </div>

      {/* Bouton comparer */}
      {results.length === 0 && (
        <Button onClick={handleCompare} disabled={isComparing} fullWidth>
          {isComparing ? <LoadingSpinner size="sm" /> : <GitCompare className="w-4 h-4 mr-2" />}
          {isComparing ? 'Analyse en cours...' : 'Comparer les contrats avec IA'}
        </Button>
      )}

      {/* Résultats */}
      {results.length > 0 && (
        <>
          <Card className={`border-2 ${winner === contract1.id ? 'border-green-500' : winner === contract2.id ? 'border-red-500' : 'border-gray-300'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-purple-600" />
                Résultat de la comparaison IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              {winner && (
                <div className={`p-3 rounded-lg mb-4 text-center ${winner === contract1.id ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <p className="font-semibold">
                    {winner === contract1.id ? 'Le contrat 1 est recommandé' : 'Le contrat 2 est recommandé'}
                  </p>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Critère</th>
                      <th className="text-center py-2">Contrat 1</th>
                      <th className="text-center py-2">Contrat 2</th>
                      <th className="text-center py-2">Recommandation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 font-medium">{result.field}</td>
                        <td className="py-2 text-center">{result.contract1Value}</td>
                        <td className="py-2 text-center">{result.contract2Value}</td>
                        <td className="py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {getWinnerIcon(result.winner, result.field, result.contract1Value, result.contract2Value)}
                            <span className="text-xs">{result.recommendation}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setResults([])}>
              Nouvelle comparaison
            </Button>
            {winner && onSelectWinner && (
              <Button variant="primary" onClick={() => onSelectWinner(winner)}>
                Sélectionner ce contrat
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ContractComparison;