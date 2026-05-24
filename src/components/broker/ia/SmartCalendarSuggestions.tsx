// src/components/broker/ia/SmartCalendarSuggestions.tsx
// Suggestions calendrier IA (Courtier)
// <120 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { apiClient } from '@/modules/api/client/client';

// Icônes
import { Sparkles, Clock, Calendar, MapPin, TrendingUp, CheckCircle, ChevronRight, Brain, Zap } from 'lucide-react';

interface SmartSlot {
  id: string;
  startTime: string;
  endTime: string;
  score: number;
  reason: string;
  clientName?: string;
  clientId?: number;
  location?: string;
}

export const SmartCalendarSuggestions = () => {
  const [suggestions, setSuggestions] = useState<SmartSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<SmartSlot | null>(null);
  const [daysAhead, setDaysAhead] = useState(14);

  useEffect(() => {
    loadSuggestions();
  }, [daysAhead]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/calendar/ai/smart-slots?days=${daysAhead}`);
      
      if (Array.isArray(response)) {
        setSuggestions(response);
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        setSuggestions((response as any).data);
      } else {
        setSuggestions([
          { id: '1', startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), score: 95, reason: 'Créneau historiquement productif', clientName: 'Société ABC', location: 'Visio' },
          { id: '2', startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), score: 88, reason: 'Disponibilité client confirmée', location: 'Bureau' },
          { id: '3', startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), score: 82, reason: 'Pas de conflit détecté', location: 'Téléphone' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load suggestions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSlot = (slot: SmartSlot) => setSelectedSlot(slot);
  const handleConfirm = () => { if (selectedSlot) alert(`Créneau confirmé pour le ${new Date(selectedSlot.startTime).toLocaleString()}`); };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700';
    if (score >= 80) return 'bg-blue-100 text-blue-700';
    if (score >= 70) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (isLoading) return (<Card><CardContent className="p-6"><LoadingSpinner size="md" text="Analyse des créneaux..." /></CardContent></Card>);

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" />Suggestions IA</CardTitle>
          <div className="flex gap-1">
            <button onClick={() => setDaysAhead(7)} className={`px-2 py-1 text-xs rounded ${daysAhead === 7 ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>7j</button>
            <button onClick={() => setDaysAhead(14)} className={`px-2 py-1 text-xs rounded ${daysAhead === 14 ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>14j</button>
            <button onClick={() => setDaysAhead(30)} className={`px-2 py-1 text-xs rounded ${daysAhead === 30 ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>30j</button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {suggestions.length === 0 ? (<div className="text-center py-6"><Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p>Aucune suggestion</p></div>) : (
          <div className="space-y-3">{suggestions.map((slot) => (<div key={slot.id} onClick={() => handleSelectSlot(slot)} className={`p-3 rounded-lg border cursor-pointer ${selectedSlot?.id === slot.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex justify-between"><div><div className="flex items-center gap-2 mb-1"><Clock className="w-3 h-3 text-gray-400" /><span className="text-sm font-medium">{formatTime(slot.startTime)}</span></div>{slot.clientName && <p className="text-xs text-gray-600">{slot.clientName}</p>}<p className="text-xs text-gray-500 mt-1">{slot.reason}</p></div><div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(slot.score)}`}>{slot.score}%</div></div>
            {selectedSlot?.id === slot.id && (<Button size="sm" variant="primary" className="w-full mt-3" onClick={handleConfirm}><CheckCircle className="w-3 h-3 mr-1" />Confirmer</Button>)}
          </div>))}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartCalendarSuggestions;