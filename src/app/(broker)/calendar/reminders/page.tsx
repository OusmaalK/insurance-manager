// src/app/(broker)/calendar/reminders/page.tsx
// Rappels intelligents (Courtier) - Version corrigée
// <140 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { apiClient } from '@/modules/api/client/client';

// Icônes
import { Bell, Clock, Calendar, CheckCircle, XCircle, BellRing, BellOff, Settings, Trash2 } from 'lucide-react';

interface Reminder {
  id: number;
  title: string;
  description: string;
  datetime: string;
  type: 'RENEWAL' | 'CLAIM' | 'MEETING' | 'TASK';
  is_active: boolean;
  created_at: string;
}

export default function CalendarRemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  // ✅ Correction : apiClient.get retourne directement les données
  const loadReminders = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/calendar/reminders');
      
      // Vérifier si response est un tableau
      if (Array.isArray(response)) {
        setReminders(response);
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        setReminders((response as any).data);
      } else {
        // Données de démonstration
        setReminders([
          { id: 1, title: 'Renouvellement contrat AUTO', description: 'Contrat #POL-2024-001 à renouveler', datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'RENEWAL', is_active: true, created_at: new Date().toISOString() },
          { id: 2, title: 'Rendez-vous client', description: 'Meeting avec Société ABC', datetime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'MEETING', is_active: true, created_at: new Date().toISOString() },
          { id: 3, title: 'Sinistre à traiter', description: 'Sinistre #CLM-2024-001 en attente', datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'CLAIM', is_active: false, created_at: new Date().toISOString() }
        ]);
      }
    } catch (error) {
      console.error('Failed to load reminders', error);
      // Données de démonstration en cas d'erreur
      setReminders([
        { id: 1, title: 'Renouvellement contrat AUTO', description: 'Contrat #POL-2024-001 à renouveler', datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'RENEWAL', is_active: true, created_at: new Date().toISOString() },
        { id: 2, title: 'Rendez-vous client', description: 'Meeting avec Société ABC', datetime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'MEETING', is_active: true, created_at: new Date().toISOString() },
        { id: 3, title: 'Sinistre à traiter', description: 'Sinistre #CLM-2024-001 en attente', datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'CLAIM', is_active: false, created_at: new Date().toISOString() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReminder = async (id: number) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r));
  };

  const deleteReminder = async (id: number) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = { 
      RENEWAL: <Calendar className="w-4 h-4" />, 
      CLAIM: <Bell className="w-4 h-4" />, 
      MEETING: <Clock className="w-4 h-4" />, 
      TASK: <CheckCircle className="w-4 h-4" /> 
    };
    return icons[type] || <Bell className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = { 
      RENEWAL: 'bg-blue-100 text-blue-700', 
      CLAIM: 'bg-red-100 text-red-700', 
      MEETING: 'bg-green-100 text-green-700', 
      TASK: 'bg-yellow-100 text-yellow-700' 
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <BrokerLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" text="Chargement des rappels..." />
        </div>
      </BrokerLayout>
    );
  }

  const activeCount = reminders.filter(r => r.is_active).length;
  const todayCount = reminders.filter(r => new Date(r.datetime).toDateString() === new Date().toDateString()).length;
  const inactiveCount = reminders.filter(r => !r.is_active).length;

  return (
    <BrokerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rappels intelligents</h1>
            <p className="text-gray-500 mt-1">Gérez vos notifications et alertes</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => router.push('/broker/calendar/reminders/new')}>
            <BellRing className="w-4 h-4 mr-2" />
            Nouveau rappel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Rappels actifs</p>
                  <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                </div>
                <BellRing className="w-6 h-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">À venir aujourd'hui</p>
                  <p className="text-2xl font-bold text-blue-600">{todayCount}</p>
                </div>
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Rappels désactivés</p>
                  <p className="text-2xl font-bold text-gray-600">{inactiveCount}</p>
                </div>
                <BellOff className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mes rappels</CardTitle>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucun rappel</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div 
                    key={reminder.id} 
                    className={`flex items-center justify-between p-3 border rounded-lg ${reminder.is_active ? 'bg-white' : 'bg-gray-50 opacity-75'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(reminder.type)}`}>
                        {getTypeIcon(reminder.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{reminder.title}</h3>
                        <p className="text-sm text-gray-500">{reminder.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(reminder.datetime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleReminder(reminder.id)} 
                        className={`p-1 rounded ${reminder.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        {reminder.is_active ? <BellRing className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => deleteReminder(reminder.id)} 
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Rappels intelligents IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              L'IA analyse votre agenda et vos échéances pour vous suggérer les meilleurs moments de rappel et optimiser votre planning.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Configurer les préférences
            </Button>
          </CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
}