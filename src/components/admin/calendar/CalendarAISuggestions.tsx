// src/components/admin/calendar/CalendarAISuggestions.tsx
'use client';

import { useState, useEffect } from 'react';
import { Brain, Clock, Calendar, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useCalendarAI } from '@/hooks/useCalendarAI';

export const CalendarAISuggestions = () => {
  const { suggestions, getSuggestions, isLoading } = useCalendarAI();
  const [accepted, setAccepted] = useState<number[]>([]);

  useEffect(() => {
    getSuggestions();
  }, []);

  const handleAccept = (id: number) => {
    setAccepted([...accepted, id]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <CardTitle>Suggestions IA</CardTitle>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Optimisation temps</span>
          </div>
          <Button variant="ghost" size="sm">
            Tout appliquer <Sparkles className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Créneaux optimaux basés sur votre historique</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-center py-6 text-gray-500">Analyse en cours...</div>
        ) : suggestions?.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Aucune suggestion pour le moment</div>
        ) : (
          suggestions?.slice(0, 4).map((suggestion) => (
            <div key={suggestion.id} className={`p-3 rounded-lg border transition-all ${accepted.includes(suggestion.id) ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <p className="font-medium">{suggestion.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(suggestion.suggested_start).toLocaleString()}</span>
                    <span className="text-purple-600">Confiance: {suggestion.confidence_score}%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{suggestion.reason}</p>
                </div>
                {!accepted.includes(suggestion.id) && (
                  <button 
                    onClick={() => handleAccept(suggestion.id)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {accepted.includes(suggestion.id) && (
                  <span className="text-xs text-green-600">Ajouté</span>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};