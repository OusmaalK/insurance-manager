// src/components/admin/layout/AdminSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
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
  X,
  Home,
  Calendar,
  Bell,
  Award
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Entreprises', href: '/admin/companies', icon: Building2 },
  { name: 'Contrats', href: '/admin/policies', icon: FileText },
  { name: 'Sinistres', href: '/admin/claims', icon: AlertTriangle },
  { name: 'Calendrier', href: '/admin/calendar', icon: Calendar },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Rapports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Configuration IA', href: '/admin/ia-settings', icon: Bot },
  { name: 'Audit', href: '/admin/audit-logs', icon: Shield },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export const AdminSidebar = ({ collapsed = false, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-2 rounded-lg transition-all duration-200
                ${active 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
              {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer - User Info & Logout */}
      <div className="p-3 border-t border-gray-200">
        {!collapsed && user && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`
            flex items-center w-full px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3 text-sm font-medium">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;