// src/app/admin/calendar/new/page.tsx
// Page de création d'événement - Version allégée
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';
import { useCalendarAI } from '@/hooks/useCalendarAI';
import { CalendarEventForm, CalendarAIBanner } from '@/components/admin/calendar';

export default function NewEventPage() {
  const router = useRouter();
  const { createEvent, isLoading: eventLoading } = useCalendar();
  const { getOptimalSlots, isLoading: aiLoading } = useCalendarAI();

  const handleSubmit = async (formData: any) => {
    const submitData = {
      title: formData.title,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      type: formData.type,
      priority: formData.priority,
      location: formData.location,
      attendees: formData.attendees ? formData.attendees.split(',').map((s: string) => s.trim()) : [],
      reminder_minutes: formData.reminder_minutes,
      related_id: formData.related_id ? parseInt(formData.related_id) : undefined,
      related_type: formData.related_type || undefined,
    };
    
    const result = await createEvent(submitData);
    if (result) {
      router.push('/admin/calendar');
    }
  };

  const handleAISuggestions = async () => {
    const duration = 60;
    const slots = await getOptimalSlots(duration);
    return slots?.optimal_slots || [];
  };

  const handleCancel = () => {
    router.push('/admin/calendar');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/calendar" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvel événement</h1>
          <p className="text-sm text-gray-500 mt-1">Création avec suggestions IA intelligentes</p>
        </div>
      </div>

      {/* Bannière IA */}
      <CalendarAIBanner />

      {/* Formulaire */}
      <CalendarEventForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={eventLoading}
        onAISuggestions={handleAISuggestions}
        isAILoading={aiLoading}
      />
    </div>
  );
}