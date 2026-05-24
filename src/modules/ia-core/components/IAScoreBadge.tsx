// src/modules/ia-core/components/IAScoreBadge.tsx
// Badge d'affichage du score IA
// <80 lignes

'use client';

import React from 'react';

// ============================================
// TYPES
// ============================================

interface IAScoreBadgeProps {
  score: number;
  type?: 'RISK' | 'FRAUD' | 'RENEWAL';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const IAScoreBadge = ({ 
  score, 
  type = 'RISK', 
  size = 'md', 
  showLabel = true,
  className = ''
}: IAScoreBadgeProps) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-red-600';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getScoreLevel = (score: number): string => {
    if (score >= 80) return 'CRITIQUE';
    if (score >= 60) return 'ÉLEVÉ';
    if (score >= 40) return 'MOYEN';
    if (score >= 20) return 'FAIBLE';
    return 'TRÈS FAIBLE';
  };

  const getScoreLabel = (): string => {
    switch (type) {
      case 'RISK': return 'Risque';
      case 'FRAUD': return 'Fraude';
      case 'RENEWAL': return 'Renouvellement';
      default: return 'Score';
    }
  };

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const getScoreDisplay = (): string => {
    if (type === 'RENEWAL') {
      return `${Math.round(score)}%`;
    }
    return `${Math.round(score)}`;
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full ${getScoreColor(score)} ${sizeClasses[size]} ${className}`}>
      <span className="font-medium text-white">
        {getScoreDisplay()}
      </span>
      {showLabel && (
        <span className="text-white/80 text-xs">
          {getScoreLabel()}
        </span>
      )}
    </div>
  );
};

export default IAScoreBadge;