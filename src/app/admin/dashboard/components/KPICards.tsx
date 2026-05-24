// src/app/admin/dashboard/components/KPICards.tsx
'use client';

export function KPICards({ kpis }: { kpis: any[] }) {
  if (!kpis || kpis.length === 0) {
    return <div>Chargement des indicateurs...</div>;
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gap: '16px'
    }}>
      {kpis.map((kpi, idx) => (
        <div key={idx} style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          border: '1px solid #e5e7eb', 
          padding: '20px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: kpi.bg, borderRadius: '8px' }}>
              <span style={{ fontSize: '20px' }}>📊</span>
            </div>
            <span style={{ 
              fontSize: '12px', 
              padding: '2px 8px', 
              borderRadius: '20px',
              backgroundColor: kpi.trend === 'up' ? '#d1fae5' : '#fee2e2',
              color: kpi.trend === 'up' ? '#065f46' : '#991b1b'
            }}>
              {kpi.change}
            </span>
          </div>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{kpi.value}</p>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{kpi.title}</p>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>{kpi.description}</p>
        </div>
      ))}
    </div>
  );
}