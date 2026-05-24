// src/shared/layout/AdminLayout.tsx
// Layout complet pour l'espace Administrateur
// <100 lignes

'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

// ============================================
// TYPES
// ============================================

interface AdminLayoutProps {
  children: React.ReactNode;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <div className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <AdminSidebar collapsed={!sidebarOpen} />
      </div>

      {/* Sidebar Mobile */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileSidebar} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <AdminSidebar onClose={closeMobileSidebar} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <AdminHeader onMenuClick={toggleSidebar} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;