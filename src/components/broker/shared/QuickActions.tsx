// src/components/broker/shared/QuickActions.tsx
// Actions rapides pour le courtier
// <80 lignes

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

// Icônes
import {
  UserPlus,
  FilePlus,
  CalendarPlus,
  FileText,
  Bot,
  TrendingUp,
  Gift,
  Bell
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

interface QuickActionsProps {
  onAction?: (actionId: string) => void;
  customActions?: QuickAction[];
}

// ============================================
// ACTIONS PAR DÉFAUT
// ============================================

const defaultActions = (onAction?: (id: string) => void): QuickAction[] => [
  {
    id: 'new-client',
    label: 'Nouveau client',
    icon: <UserPlus className="w-4 h-4" />,
    onClick: () => onAction?.('new-client'),
    variant: 'primary'
  },
  {
    id: 'new-policy',
    label: 'Nouveau contrat',
    icon: <FilePlus className="w-4 h-4" />,
    onClick: () => onAction?.('new-policy'),
    variant: 'secondary'
  },
  {
    id: 'schedule-meeting',
    label: 'Planifier rdv',
    icon: <CalendarPlus className="w-4 h-4" />,
    onClick: () => onAction?.('schedule-meeting'),
    variant: 'outline'
  },
  {
    id: 'generate-report',
    label: 'Rapport client',
    icon: <FileText className="w-4 h-4" />,
    onClick: () => onAction?.('generate-report'),
    variant: 'outline'
  },
  {
    id: 'ai-assistant',
    label: 'Assistant IA',
    icon: <Bot className="w-4 h-4" />,
    onClick: () => onAction?.('ai-assistant'),
    variant: 'outline'
  },
  {
    id: 'commission-forecast',
    label: 'Prévisions commissions',
    icon: <TrendingUp className="w-4 h-4" />,
    onClick: () => onAction?.('commission-forecast'),
    variant: 'outline'
  }
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const QuickActions = ({ onAction, customActions }: QuickActionsProps) => {
  const actions = customActions || defaultActions(onAction);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              className="flex items-center justify-center gap-2"
            >
              {action.icon}
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;