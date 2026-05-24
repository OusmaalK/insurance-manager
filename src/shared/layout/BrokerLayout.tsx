// src/shared/layout/BrokerLayout.tsx
// Layout pour l'espace Courtier
// <80 lignes

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle,
  Calendar,
  BarChart3,
  Bot,
  LogOut,
  Menu,
  X,
  Gift,
  DollarSign
} from 'lucide-react';

interface BrokerLayoutProps {
  children: ReactNode;
}

export const BrokerLayout = ({ children }: BrokerLayoutProps) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-white border-r border-gray-200`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-green-600">Broker Space</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 group"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">
                  {user?.firstName?.charAt(0) || 'B'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">Espace Courtier</h2>
            <div className="w-10" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BrokerLayout;