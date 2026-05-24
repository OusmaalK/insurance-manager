// src/components/admin/calendar/CalendarEventForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, FileText, Bell, Save, X, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { EVENT_TYPES, EVENT_PRIORITIES } from '@/types/calendar.types';

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  type: 'MEETING' | 'TASK' | 'REMINDER' | 'DEADLINE' | 'RENEWAL';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  attendees: string;
  reminder_minutes: number;
  related_id: string;
  related_type: 'POLICY' | 'CLAIM' | 'COMPANY' | 'CLIENT' | '';
}

interface CalendarEventFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onAISuggestions?: () => void;
  aiSuggestions?: any[];
  isAILoading?: boolean;
}

export const CalendarEventForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  onAISuggestions,
  aiSuggestions = [],
  isAILoading = false
}: CalendarEventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    type: 'MEETING',
    priority: 'MEDIUM',
    location: '',
    attendees: '',
    reminder_minutes: 30,
    related_id: '',
    related_type: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Titre requis';
    if (!formData.start_date) newErrors.start_date = 'Date de début requise';
    if (!formData.end_date) newErrors.end_date = 'Date de fin requise';
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = 'La date de fin doit être après la date de début';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleAIClick = () => {
    if (onAISuggestions) {
      onAISuggestions();
      setShowAISuggestions(true);
    }
  };

  const handleUseAISlot = (slot: any) => {
    setFormData(prev => ({
      ...prev,
      start_date: slot.start,
      end_date: slot.end,
    }));
    setShowAISuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'événement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Réunion équipe, Appel client..."
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Type et Priorité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(EVENT_TYPES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(EVENT_PRIORITIES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.start_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.end_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Bouton IA */}
          {onAISuggestions && (
            <button
              type="button"
              onClick={handleAIClick}
              disabled={isAILoading}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <Brain className="w-4 h-4" />
              {isAILoading ? 'Analyse en cours...' : 'Suggestions IA de créneaux'}
            </button>
          )}

          {/* Suggestions IA */}
          {showAISuggestions && aiSuggestions.length > 0 && (
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Créneaux optimaux suggérés
              </p>
              <div className="space-y-2">
                {aiSuggestions.slice(0, 3).map((slot, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{new Date(slot.start).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Score: {slot.score}%</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleUseAISlot(slot)}>
                      Utiliser
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Description détaillée..."
            />
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Adresse, lien visio..."
              />
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                placeholder="email1@exemple.com, email2@exemple.com"
              />
            </div>
          </div>

          {/* Rappel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rappel</label>
            <div className="relative">
              <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                name="reminder_minutes"
                value={formData.reminder_minutes}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={5}>5 minutes avant</option>
                <option value={15}>15 minutes avant</option>
                <option value={30}>30 minutes avant</option>
                <option value={60}>1 heure avant</option>
                <option value={1440}>1 jour avant</option>
              </select>
            </div>
          </div>

          {/* Association */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Associer à (ID)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="related_id"
                  value={formData.related_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="ID du contrat, sinistre..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type associé</label>
              <select
                name="related_type"
                value={formData.related_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Non associé</option>
                <option value="POLICY">Contrat</option>
                <option value="CLAIM">Sinistre</option>
                <option value="COMPANY">Entreprise</option>
                <option value="CLIENT">Client</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4 mr-2" />}
          {isSubmitting || isLoading ? 'Création...' : 'Créer l\'événement'}
        </Button>
      </div>
    </form>
  );
};

// ✅ AJOUTER CETTE LIGNE - Export par défaut obligatoire
export default CalendarEventForm;