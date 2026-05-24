// src/components/admin/calendar/CalendarAIBanner.tsx
'use client';

import { Brain } from 'lucide-react';

export const CalendarAIBanner = () => (
  <div className="mb-6 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
    <div className="flex items-start gap-3">
      <Brain className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-gray-900">Optimisation IA disponible</p>
        <p className="text-xs text-gray-600">
          L'IA peut vous suggérer les meilleurs créneaux horaires selon votre agenda et vos habitudes.
        </p>
      </div>
    </div>
  </div>
);

// ✅ Ajouter l'export par défaut
export default CalendarAIBanner;