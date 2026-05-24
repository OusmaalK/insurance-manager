// src/components/admin/settings/AISettings.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';

export const AISettings = () => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Configuration IA
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <Brain className="w-12 h-12 text-purple-300 mx-auto mb-3" />
        <p className="text-gray-600 mb-4">
          Les paramètres IA sont gérés dans un espace dédié
        </p>
        <Button variant="primary" onClick={() => router.push('/admin/ia-settings')}>
          Configurer l'IA
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};