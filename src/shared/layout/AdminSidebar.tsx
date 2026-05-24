// src/shared/layout/AdminSidebar.tsx
// Sidebar pour l'espace Administrateur
// <100 lignes

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Icônes
import {
  LayoutDashboard,
  Building2,
  FileText,
  AlertTriangle,
  Users,
  Settings,
  BarChart3,
  Bot,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

// ============================================
// NAVIGATION
// ============================================

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Entreprises', href: '/admin/companies', icon: Building2 },
  { name: 'Contrats', href: '/admin/policies', icon: FileText },
  { name: 'Sinistres', href: '/admin/claims', icon: AlertTriangle },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Rapports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Configuration IA', href: '/admin/ia-settings', icon: Bot },
  { name: 'Audit', href: '/admin/audit-logs', icon: Shield },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

interface AdminSidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export const AdminSidebar = ({ collapsed = false, onClose }: AdminSidebarProps) => {
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
          <Shield className="w-6 h-6 text-blue-600" />
          {!collapsed && <span className="text-xl font-bold text-gray-800">Admin Panel</span>}
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
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
              {!collapsed && <span className="ml-3 text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        {!collapsed && (
          <div className="flex items-center mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">
                {user?.firstName?.charAt(0) || 'A'}
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

export default AdminSidebar;