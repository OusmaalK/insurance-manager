// src/app/(broker)/layout.tsx
// Layout principal pour l'espace Courtier
// <30 lignes

'use client';

import React from 'react';
import { RouteGuard } from '@/middleware/auth.middleware';
import { BrokerLayout as BrokerLayoutComponent } from '@/shared/layout/BrokerLayout';

export default function BrokerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <BrokerLayoutComponent>
        {children}
      </BrokerLayoutComponent>
    </RouteGuard>
  );
}