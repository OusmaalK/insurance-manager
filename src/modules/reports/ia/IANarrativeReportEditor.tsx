// src/modules/reports/ia/IANarrativeReportEditor.tsx
// Éditeur de rapports narratifs IA
// <150 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

// Icônes
import { Sparkles, Edit2, Save, Eye, X, CheckCircle, AlertCircle, Wand2, FileText } from 'lucide-react';

interface IANarrativeReportEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  title?: string;
}

export const IANarrativeReportEditor = ({
  initialContent = '',
  onSave,
  title = 'Rapport narratif IA',
}: IANarrativeReportEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(!initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulation de génération IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    setContent(`# Analyse du portefeuille - ${new Date().toLocaleDateString()}

## Synthèse
Le portefeuille présente une évolution positive sur la période. Les indicateurs clés montrent une augmentation de 12% du chiffre d'affaires.

## Points d'attention
- **Risque élevé**: 3 entreprises présentent un score de risque supérieur à 70
- **Échéances**: 5 contrats arrivent à échéance dans les 30 prochains jours
- **Sinistres**: Augmentation de 8% des sinistres déclarés

## Recommandations
1. Prioriser les relances pour les contrats à échéance
2. Analyser les sinistres à risque de fraude
3. Proposer des extensions de garantie aux entreprises à risque moyen

---
*Rapport généré automatiquement par l'IA*`);
    setIsGenerating(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave?.(content);
    setSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSuccess(false), 3000);
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            {!initialContent && !isEditing && (
              <Button onClick={handleGenerate} disabled={isGenerating} variant="primary" size="sm">
                {isGenerating ? <LoadingSpinner size="sm" /> : <Wand2 className="w-4 h-4 mr-2" />}
                {isGenerating ? 'Génération...' : 'Générer avec IA'}
              </Button>
            )}
            {isEditing && (
              <>
                <Button onClick={() => setPreviewMode(!previewMode)} variant="outline" size="sm">
                  {previewMode ? <Edit2 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {previewMode ? 'Éditer' : 'Prévisualiser'}
                </Button>
                <Button onClick={handleSave} disabled={isSaving} variant="primary" size="sm">
                  {isSaving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
                  Sauvegarder
                </Button>
              </>
            )}
            {!isEditing && !previewMode && initialContent && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-green-600">Rapport sauvegardé avec succès !</p>
          </div>
        )}

        {!initialContent && !isEditing && !isGenerating && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun rapport généré</p>
            <Button onClick={handleGenerate} variant="primary" className="mt-3">
              <Wand2 className="w-4 h-4 mr-2" />
              Générer un rapport avec IA
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" text="L'IA analyse vos données..." />
          </div>
        )}

        {isEditing && !previewMode && content && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}

        {previewMode && content && (
          <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg">
            {content.split('\n').map((line, idx) => {
              if (line.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-semibold mt-3 mb-2">{line.slice(3)}</h2>;
              if (line.startsWith('- ')) return <li key={idx} className="ml-4">{line.slice(2)}</li>;
              if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) 
                return <li key={idx} className="ml-4 list-decimal">{line.slice(3)}</li>;
              if (line.startsWith('---')) return <hr key={idx} className="my-4" />;
              if (line.startsWith('*')) return <p key={idx} className="text-gray-500 italic">{line.slice(1)}</p>;
              if (line.trim()) return <p key={idx} className="mb-2">{line}</p>;
              return <br key={idx} />;
            })}
          </div>
        )}

        {!isEditing && !previewMode && !isGenerating && content && (
          <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg">
            {content.split('\n').slice(0, 10).map((line, idx) => {
              if (line.startsWith('# ')) return <h1 key={idx} className="text-xl font-bold">{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={idx} className="text-lg font-semibold">{line.slice(3)}</h2>;
              if (line.trim()) return <p key={idx} className="text-sm">{line}</p>;
              return null;
            })}
            {content.split('\n').length > 10 && (
              <button onClick={() => setPreviewMode(true)} className="text-sm text-blue-600 mt-2">
                Voir la suite...
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IANarrativeReportEditor;