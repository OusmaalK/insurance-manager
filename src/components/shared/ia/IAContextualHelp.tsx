// src/components/shared/ia/IAContextualHelp.tsx
// Aide contextuelle IA
// <100 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, X, Sparkles, Lightbulb } from 'lucide-react';

interface IAContextualHelpProps {
  context: string;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  autoShow?: boolean;
}

interface HelpContent {
  title: string;
  description: string;
  tips: string[];
}

const helpContentMap: Record<string, HelpContent> = {
  'claims-list': {
    title: 'Gestion des sinistres',
    description: 'Cette liste affiche tous les sinistres de votre portefeuille.',
    tips: ['Cliquez sur un sinistre pour voir les détails', 'Utilisez les filtres pour affiner la recherche', 'L\'IA analyse automatiquement les fraudes'],
  },
  'companies-list': {
    title: 'Gestion des entreprises',
    description: 'Consultez et gérez toutes vos entreprises clientes.',
    tips: ['Ajoutez une nouvelle entreprise avec le bouton +', 'Le score de risque est calculé par IA', 'Surveillez les entreprises à risque élevé'],
  },
  'policies-list': {
    title: 'Gestion des contrats',
    description: 'Suivez tous les contrats d\'assurance de vos clients.',
    tips: ['Les contrats expirant bientôt sont surlignés', 'L\'IA prédit les renouvellements', 'Exportez les données en PDF/Excel'],
  },
  'dashboard': {
    title: 'Tableau de bord',
    description: 'Vue d\'ensemble de votre activité et des alertes IA.',
    tips: ['Les cartes colorées montrent les indicateurs clés', 'Les alertes IA nécessitent votre attention', 'Actualisez pour voir les dernières données'],
  },
};

export const IAContextualHelp = ({ context, position = 'bottom-right', autoShow = false }: IAContextualHelpProps) => {
  const [isOpen, setIsOpen] = useState(autoShow);
  const help = helpContentMap[context] || helpContentMap['dashboard'];

  useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => setIsOpen(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [autoShow]);

  const positionClasses = {
    'top-right': 'top-16 right-4',
    'bottom-right': 'bottom-20 right-4',
    'top-left': 'top-16 left-4',
    'bottom-left': 'bottom-20 left-4',
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed z-40 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors ${positionClasses[position]}`}
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 w-80 bg-white rounded-lg shadow-xl border ${positionClasses[position]}`}>
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <h3 className="font-semibold">{help.title}</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-600">{help.description}</p>
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Conseils IA
          </p>
          <ul className="mt-1 space-y-1">
            {help.tips.map((tip, idx) => (
              <li key={idx} className="text-xs text-gray-500 flex items-start gap-1">
                <span className="text-blue-500">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IAContextualHelp;