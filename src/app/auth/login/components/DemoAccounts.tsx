// src/app/auth/login/components/DemoAccounts.tsx
'use client';

import { UserCircle, Building2 } from 'lucide-react';
import { useLoginStore } from '../store/loginStore';

const demoAccounts = [
  { role: 'Administrateur', email: 'admin@courtier.fr', password: 'admin123', icon: UserCircle },
  { role: 'Courtier', email: 'broker@courtier.fr', password: 'broker123', icon: Building2 },
];

export function DemoAccounts() {
  const { onDemoSelect } = useLoginStore();

  return (
    <div>
      <p className="text-[10px] text-gray-400 text-center mb-2">Accès démonstration</p>
      <div className="flex gap-2 justify-center">
        {demoAccounts.map((account) => (
          <button
            key={account.role}
            type="button"
            onClick={() => onDemoSelect?.(account.email, account.password)}
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 rounded-lg text-white text-xs font-medium transition-all duration-300 hover:scale-105"
          >
            <account.icon className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
            {account.role}
          </button>
        ))}
      </div>
    </div>
  );
}