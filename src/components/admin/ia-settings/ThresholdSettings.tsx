// src/components/admin/ia-settings/ThresholdSettings.tsx
'use client';

import { Sliders, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { useIASettingsStore } from '@/stores/iaSettingsStore';

export const ThresholdSettings = () => {
  const { settings, updateField } = useIASettingsStore();
  const thresholds = settings?.thresholds;

  const handleChange = (field: string, value: number) => {
    updateField('thresholds', field, value);
  };

  const thresholdGroups = [
    {
      title: 'Risque',
      icon: Shield,
      color: 'text-orange-500',
      items: [
        { key: 'riskLow', label: 'Seuil bas', color: 'bg-green-500' },
        { key: 'riskMedium', label: 'Seuil moyen', color: 'bg-yellow-500' },
        { key: 'riskHigh', label: 'Seuil haut', color: 'bg-red-500' },
      ]
    },
    {
      title: 'Fraude',
      icon: AlertTriangle,
      color: 'text-red-500',
      items: [
        { key: 'fraudLow', label: 'Seuil bas', color: 'bg-green-500' },
        { key: 'fraudMedium', label: 'Seuil moyen', color: 'bg-yellow-500' },
        { key: 'fraudHigh', label: 'Seuil haut', color: 'bg-red-500' },
      ]
    },
    {
      title: 'Renouvellement',
      icon: TrendingUp,
      color: 'text-blue-500',
      items: [
        { key: 'renewalLow', label: 'Seuil bas', color: 'bg-red-500' },
        { key: 'renewalMedium', label: 'Seuil moyen', color: 'bg-yellow-500' },
        { key: 'renewalHigh', label: 'Seuil haut', color: 'bg-green-500' },
      ]
    }
  ];

  const getThresholdDescription = (key: string, value: number) => {
    const descriptions: Record<string, string> = {
      riskLow: 'Risque faible (0-{value}%)',
      riskMedium: 'Risque modéré ({value}%-{next}%)',
      riskHigh: 'Risque élevé ({value}%-100%)',
      fraudLow: 'Fraude faible (0-{value}%)',
      fraudMedium: 'Fraude modérée ({value}%-{next}%)',
      fraudHigh: 'Fraude élevée ({value}%-100%)',
      renewalLow: 'Renouvellement faible (0-{value}%)',
      renewalMedium: 'Renouvellement modéré ({value}%-{next}%)',
      renewalHigh: 'Renouvellement élevé ({value}%-100%)',
    };
    
    let description = descriptions[key] || '';
    if (key.includes('Medium')) {
      const nextKey = key.replace('Medium', 'High');
      const nextValue = thresholds?.[nextKey as keyof typeof thresholds] as number || 100;
      description = description.replace('{value}', value.toString());
      description = description.replace('{next}', nextValue.toString());
    } else {
      description = description.replace('{value}', value.toString());
    }
    return description;
  };

  if (!thresholds) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-500" />
          Seuils et Scores IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {thresholdGroups.map((group, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-2 mb-4">
              <group.icon className={`w-5 h-5 ${group.color}`} />
              <h3 className="font-semibold text-gray-900">{group.title}</h3>
            </div>
            <div className="space-y-4">
              {group.items.map((item) => {
                const value = thresholds[item.key as keyof typeof thresholds] as number;
                return (
                  <div key={item.key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={value}
                      onChange={(e) => handleChange(item.key, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {getThresholdDescription(item.key, value)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Résumé */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Résumé des seuils</p>
          <div className="space-y-1 text-xs">
            <p>🟢 Score &lt; 30%: Niveau faible</p>
            <p>🟡 Score 30% - 70%: Niveau modéré</p>
            <p>🟠 Score 70% - 90%: Niveau élevé</p>
            <p>🔴 Score &gt; 90%: Niveau critique</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThresholdSettings;