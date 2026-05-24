// src/app/admin/dashboard/components/StatsCards.tsx
'use client';

export function StatsCards() {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gap: '16px',
      marginBottom: '24px'
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #10b981, #0d9488)', 
        borderRadius: '12px', 
        padding: '20px', 
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>✓</span>
          <span style={{ fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '20px' }}>+24%</span>
        </div>
        <p style={{ fontSize: '28px', fontWeight: 'bold' }}>98.5%</p>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>Taux de satisfaction</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: '#fffbeb', borderRadius: '8px' }}>⏰</div>
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>2.4 <span style={{ fontSize: '14px', fontWeight: 'normal' }}>jours</span></p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Délai moyen</p>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: '20px' }}>
          ↓ 0.3 jour vs mois dernier
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: '#eef2ff', borderRadius: '8px' }}>🎯</div>
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>€1.2M</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Objectif trimestriel</p>
          </div>
        </div>
        <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '6px' }}>
          <div style={{ width: '68%', backgroundColor: '#4f46e5', height: '6px', borderRadius: '9999px' }}></div>
        </div>
        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>68% atteint</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: '#faf5ff', borderRadius: '8px' }}>🏆</div>
          <div>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>342</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Avis clients</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>4.8</span>
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
        </div>
      </div>
    </div>
  );
}