'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

export default function AuditLogsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/audit');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-96">
      <LoadingSpinner size="lg" text="Redirection vers l'audit..." />
    </div>
  );
}
