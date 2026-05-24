// src/components/admin/calendar/CalendarView.tsx
'use client';

import { CalendarEvent, EVENT_TYPES, formatTime } from '@/types/calendar.types';

interface CalendarViewProps {
  events: CalendarEvent[];
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  onEventClick: (id: number) => void;
}

export const CalendarView = ({ events, view, currentDate, onEventClick }: CalendarViewProps) => {
  if (view === 'month') {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const getEventsForDay = (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return events.filter(e => e.start_date.startsWith(dateStr));
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div key={day} className="text-center py-3 text-sm font-medium text-gray-500">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 border-r border-b" />
          ))}
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            
            return (
              <div key={day} className="min-h-[120px] border-r border-b p-1 hover:bg-gray-50">
                <div className={`text-right text-sm font-medium p-1 ${isToday ? 'bg-blue-600 text-white rounded-full w-6 inline-block text-center' : ''}`}>
                  {day}
                </div>
                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div 
                      key={event.id}
                      onClick={() => onEventClick(event.id)}
                      className={`text-xs p-1 rounded cursor-pointer truncate ${EVENT_TYPES[event.type]?.color || 'bg-gray-100'}`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-400 text-center">+{dayEvents.length - 3}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vue semaine simplifiée
  if (view === 'week') {
    const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8h à 20h

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b">
            <div className="p-2 text-sm font-medium text-gray-500">Heure</div>
            {weekDays.map(day => (
              <div key={day} className="p-2 text-sm font-medium text-gray-500 text-center">{day}</div>
            ))}
          </div>
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="p-2 text-xs text-gray-500">{hour}:00</div>
              {weekDays.map((_, idx) => (
                <div key={idx} className="min-h-[60px] border-l p-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vue jour simplifiée
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
      </div>
      <div className="divide-y">
        {events.filter(e => e.start_date.startsWith(currentDate.toISOString().split('T')[0])).map(event => (
          <div key={event.id} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => onEventClick(event.id)}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${event.priority === 'HIGH' ? 'bg-red-500' : event.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-500">{formatTime(event.start_date)} - {formatTime(event.end_date)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${EVENT_TYPES[event.type]?.color || 'bg-gray-100'}`}>
                {EVENT_TYPES[event.type]?.label || event.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};