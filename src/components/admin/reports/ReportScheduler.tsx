// src/components/admin/reports/ReportScheduler.tsx
'use client';

import { useState } from 'react';
import { Calendar, Clock, Mail, Bell, Save } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

interface ReportSchedulerProps {
  reportId: number;
  onSchedule?: (schedule: any) => void;
}

export const ReportScheduler = ({ reportId, onSchedule }: ReportSchedulerProps) => {
  const [schedule, setSchedule] = useState({
    enabled: false,
    frequency: 'WEEKLY',
    time: '08:00',
    recipients: '',
  });

  const handleSave = () => {
    onSchedule?.(schedule);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Planification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={schedule.enabled}
            onChange={(e) => setSchedule({...schedule, enabled: e.target.checked})}
            className="w-4 h-4"
          />
          <span>Planifier ce rapport</span>
        </label>

        {schedule.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Fréquence</label>
              <select
                value={schedule.frequency}
                onChange={(e) => setSchedule({...schedule, frequency: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="DAILY">Quotidien</option>
                <option value="WEEKLY">Hebdomadaire</option>
                <option value="MONTHLY">Mensuel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Heure</label>
              <input
                type="time"
                value={schedule.time}
                onChange={(e) => setSchedule({...schedule, time: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Destinataires</label>
              <input
                type="text"
                value={schedule.recipients}
                onChange={(e) => setSchedule({...schedule, recipients: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="email@exemple.com"
              />
            </div>
          </>
        )}

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Enregistrer la planification
        </Button>
      </CardContent>
    </Card>
  );
};