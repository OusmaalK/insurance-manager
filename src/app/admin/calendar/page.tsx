// src/app/admin/calendar/page.tsx
// Page calendrier administrateur avec IA transversale visible
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Plus, ChevronLeft, ChevronRight, 
  Brain, Clock, CheckCircle, AlertCircle, Sparkles,
  Zap, Target, Award, Bell, TrendingUp
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { useCalendar } from '@/hooks/useCalendar';
import { useCalendarAI } from '@/hooks/useCalendarAI';
import { CalendarView } from '@/components/admin/calendar/CalendarView';
import { CalendarAISuggestions } from '@/components/admin/calendar/CalendarAISuggestions';
import { CalendarProductivityReport } from '@/components/admin/calendar/CalendarProductivityReport';
import { EVENT_TYPES, EVENT_PRIORITIES } from '@/types/calendar.types';

// ============================================
// BANNIÈRE IA TRANSVERSALE (TOUJOURS VISIBLE)
// ============================================
const IATransversalBanner = () => {
  const router = useRouter();
  
  return (
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-4 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg animate-pulse">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold">IA Transversale Active</h3>
              <span className="text-xs bg-green-500/30 px-2 py-0.5 rounded-full">Temps réel</span>
              <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full">Gemini 2.0</span>
            </div>
            <p className="text-purple-100 text-sm mt-1">
              L'IA analyse votre agenda et suggère les créneaux optimaux. Productivité estimée: <strong className="text-white">+32%</strong>
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-purple-200">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Suggestions actives: 4</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Précision: 94%</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Temps économisé: 2.5h/semaine</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => router.push('/admin/ia/dashboard')}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-all whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          Tableau de bord IA
        </button>
      </div>
    </div>
  );
};

// ============================================
// STATISTIQUES RAPIDES
// ============================================
const StatsCards = ({ stats, isLoading }: { stats: any; isLoading: boolean }) => {
  const cards = [
    { title: 'Événements', value: stats?.total || 0, icon: Calendar, color: 'bg-blue-500' },
    { title: 'À venir', value: stats?.upcoming || 0, icon: Clock, color: 'bg-green-500' },
    { title: 'En retard', value: stats?.overdue || 0, icon: AlertCircle, color: 'bg-red-500' },
    { title: 'Terminés', value: stats?.completed || 0, icon: CheckCircle, color: 'bg-purple-500' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="animate-pulse h-24 bg-gray-100 rounded-lg"></div>)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className={`${card.color} p-2 rounded-lg`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold">{card.value}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

// ============================================
// COMPOSANT ALERTES IA
// ============================================
const IAAlertWidget = () => {
  const [alerts] = useState([
    { id: 1, message: "Conflit détecté: 2 réunions se chevauchent", type: "warning" },
    { id: 2, message: "Réunion importante dans 30 minutes", type: "info" },
    { id: 3, message: "Créneau optimal disponible cet après-midi", type: "success" },
  ]);

  return (
    <Card className="border-amber-200">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <h4 className="text-sm font-medium">Alertes intelligentes</h4>
        </div>
        <div className="space-y-1">
          {alerts.map(alert => (
            <div key={alert.id} className="text-xs text-gray-600 flex items-start gap-2">
              <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5" />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// PAGE PRINCIPALE
// ============================================
export default function CalendarPage() {
  const router = useRouter();
  const { events, isLoading, fetchStats } = useCalendar({ autoFetch: true });
  const { getSuggestions, getProductivityReport } = useCalendarAI();
  const [stats, setStats] = useState<any>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAIPanel, setShowAIPanel] = useState(true);

  useEffect(() => {
    const loadStats = async () => { const data = await fetchStats(); if (data) setStats(data); };
    loadStats();
  }, [fetchStats]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(currentDate.getMonth() - 1);
    else if (view === 'week') newDate.setDate(currentDate.getDate() - 7);
    else newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(currentDate.getMonth() + 1);
    else if (view === 'week') newDate.setDate(currentDate.getDate() + 7);
    else newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Calendrier
          </h1>
          <p className="text-sm text-gray-500 mt-1">Planning intelligent avec IA transversale</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAIPanel(!showAIPanel)}>
            <Brain className="w-4 h-4 mr-2" />
            {showAIPanel ? 'Masquer IA' : 'Activer IA'}
          </Button>
          <Button variant="primary" onClick={() => router.push('/admin/calendar/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Bannière IA Transversale - TOUJOURS VISIBLE */}
      <IATransversalBanner />

      {/* Stats */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Panneau IA (Widgets supplémentaires) */}
      {showAIPanel && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CalendarAISuggestions />
          <CalendarProductivityReport />
          <IAAlertWidget />
        </div>
      )}

      {/* Contrôles calendrier */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-lg font-semibold ml-2">
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="flex gap-2">
          {['month', 'week', 'day'].map((v) => (
            <button 
              key={v}
              onClick={() => setView(v as any)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                view === v ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {v === 'month' ? 'Mois' : v === 'week' ? 'Semaine' : 'Jour'}
            </button>
          ))}
        </div>
      </div>

      {/* Vue calendrier */}
      <CalendarView 
        events={events} 
        view={view} 
        currentDate={currentDate} 
        onEventClick={(id) => router.push(`/admin/calendar/${id}`)}
      />

      {/* Badge IA en bas */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t flex items-center justify-center gap-2">
        <Brain className="w-3 h-3 text-purple-400" />
        <span>Planning optimisé par IA transversale • Gemini 2.0</span>
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </div>
    </div>
  );
}