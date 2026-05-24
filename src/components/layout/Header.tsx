// src/components/layout/Header.tsx
'use client';  // ← Doit être la première ligne

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  Shield, 
  RefreshCw,
  Settings,
  LogOut,
  User,
  HelpCircle
} from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
  notifications?: number;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export function Header({ 
  onRefresh, 
  isLoading = false, 
  notifications = 3,
  userName = "Alexandre Dubois",
  userRole = "Administrateur",
  userAvatar = "AD"
}: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      console.log('Recherche:', searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    router.push('/auth/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-base sm:text-lg bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Insurance Broker
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-400">Platform Admin</p>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="hidden md:block relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Taper ici pour rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 rounded">⌘K</kbd>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onRefresh}
              className={`p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            <div className="h-5 sm:h-6 w-px bg-gray-200" />

            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-xl transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">{userName}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400">{userRole}</p>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
                    {userAvatar}
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={() => router.push('/profile')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <User className="w-4 h-4" /> Mon profil
                      </button>
                      <button
                        onClick={() => router.push('/settings')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <Settings className="w-4 h-4" /> Paramètres
                      </button>
                      <button
                        onClick={() => router.push('/help')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <HelpCircle className="w-4 h-4" /> Aide
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Menu mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              Tableau de bord
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              Clients
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              Contrats
            </button>
            <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              Sinistres
            </button>
            <div className="border-t border-gray-100 pt-2 mt-2">
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}