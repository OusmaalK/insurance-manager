// src/app/admin/dashboard/components/PremiumChart.tsx
'use client';

export function PremiumChart({ data }: { data: any[] }) {
  const maxValue = Math.max(...data.map(d => d.primes));
  const chartHeight = 180;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontWeight: '600', color: '#1f2937' }}>Évolution des primes</h3>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
            <span>2026</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#e5e7eb', borderRadius: '50%' }}></div>
            <span>2025</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: `${chartHeight}px` }}>
        {data.map((item, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div 
              style={{ 
                width: '100%', 
                backgroundColor: '#3b82f6', 
                borderRadius: '4px 4px 0 0',
                height: `${(item.primes / maxValue) * chartHeight}px`,
                minHeight: '4px'
              }} 
            />
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}