// src/app/auth/login/components/SecurityBadges.tsx
'use client';

import { Lock, Brain, Sparkles, Shield, Fingerprint, Server } from 'lucide-react';

const badges = [
  { icon: Lock, label: 'Chiffrement SSL', color: 'text-green-400' },
  { icon: Brain, label: 'IA Anti-fraude', color: 'text-purple-400' },
  { icon: Sparkles, label: '2FA disponible', color: 'text-amber-400' },
  { icon: Shield, label: 'Protection RGPD', color: 'text-blue-400' },
  { icon: Fingerprint, label: 'Biométrie', color: 'text-indigo-400' },
  { icon: Server, label: 'Cloud souverain', color: 'text-cyan-400' },
];

export function SecurityBadges() {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
          <badge.icon className={`w-3 h-3 ${badge.color}`} />
          <span className="text-[9px] text-gray-300">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}