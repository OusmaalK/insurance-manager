// src/shared/layout/BrokerSidebar.tsx
// Sidebar pour l'espace Courtier
// <100 lignes

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Icônes
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  Calendar,
  BarChart3,
  Bot,
  LogOut,
  Gift,
  DollarSign,
  Shield,
  X
} from 'lucide-react';

// ============================================
// NAVIGATION
// ============================================

const navigation = [
  { name: 'Dashboard', href: '/broker/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/broker/clients', icon: Users },
  { name: 'Contrats', href: '/broker/policies', icon: FileText },
  { name: 'Sinistres', href: '/broker/claims', icon: AlertTriangle },
  { name: 'Calendrier', href: '/broker/calendar', icon: Calendar },
  { name: 'Commissions', href: '/broker/commissions', icon: DollarSign },
  { name: 'Rapports', href: '/broker/reports', icon: BarChart3 },
  { name: 'Assistant IA', href: '/broker/ai-assistant', icon: Bot },
  { name: 'Anniversaires', href: '/broker/clients-birthday', icon: Gift },
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

interface BrokerSidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export const BrokerSidebar = ({ collapsed = false, onClose }: BrokerSidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-600" />
          {!collapsed && <span className="text-xl font-bold text-gray-800">Broker</span>}
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                active
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-green-600' : 'text-gray-500'}`} />
              {!collapsed && <span className="ml-3 text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        {!collapsed && (
          <div className="flex items-center mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-sm font-bold text-green-600">
                {user?.firstName?.charAt(0) || 'B'}
              </span>
            </div>
            <div className="ml-2 flex-1">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3 text-sm">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default BrokerSidebar;