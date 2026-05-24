// src/modules/calendar-optimizer/SharedCalendarSlots.tsx
// Composant partagé pour les créneaux calendrier
// <100 lignes

'use client';

import React from 'react';
import { Button } from '@/shared/ui/Button';

// Icônes
import { Clock, MapPin, Users, Video, Phone, CheckCircle, XCircle } from 'lucide-react';

export interface CalendarSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  title?: string;
  location?: string;
  type?: 'meeting' | 'call' | 'video' | 'task';
  isAvailable?: boolean;
}

interface SharedCalendarSlotsProps {
  slots: CalendarSlot[];
  onSelectSlot?: (slot: CalendarSlot) => void;
  selectedSlotId?: string;
  isLoading?: boolean;
}

export const SharedCalendarSlots = ({ slots, onSelectSlot, selectedSlotId, isLoading = false }: SharedCalendarSlotsProps) => {
  const formatTimeRange = (start: Date, end: Date) => {
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'video': return <Video className="w-3 h-3" />;
      case 'call': return <Phone className="w-3 h-3" />;
      case 'task': return <CheckCircle className="w-3 h-3" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 border rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Aucun créneau disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {slots.map((slot) => {
        const isSelected = selectedSlotId === slot.id;
        const isAvailable = slot.isAvailable !== false;
        
        return (
          <div
            key={slot.id}
            onClick={() => isAvailable && onSelectSlot?.(slot)}
            className={`p-3 border rounded-lg transition-all ${
              isAvailable ? 'cursor-pointer hover:bg-gray-50' : 'opacity-50 bg-gray-50'
            } ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {getTypeIcon(slot.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{slot.title || 'Créneau disponible'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeRange(slot.startTime, slot.endTime)}
                    </span>
                    {slot.location && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {slot.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {isAvailable && !isSelected && (
                <Button variant="outline" size="sm" className="text-xs">
                  Sélectionner
                </Button>
              )}
              {isSelected && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {!isAvailable && (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SharedCalendarSlots;