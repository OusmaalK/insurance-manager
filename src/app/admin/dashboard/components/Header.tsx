// src/app/admin/dashboard/components/Header.tsx
'use client';

import { useState } from 'react';

interface HeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
  notifications?: number;
}

export function Header({ onRefresh, isLoading = false, notifications = 0 }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      <div style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold' }}>IB</span>
            </div>
            <div>
              <h1 style={{ fontWeight: 'bold', fontSize: '18px', color: '#1f2937' }}>Dashboard Admin</h1>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>Insurance Broker Platform</p>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '384px' }}>
            <input
              type="text"
              placeholder="Taper ici pour rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onRefresh}
              style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              🔄
            </button>
            <button style={{ position: 'relative', padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              🔔
              {notifications > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%'
                }} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}