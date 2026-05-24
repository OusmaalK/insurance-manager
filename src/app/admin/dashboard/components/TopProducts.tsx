// src/app/admin/dashboard/components/TopProducts.tsx
'use client';

export function TopProducts({ products, onViewDetails }: { products: any[]; onViewDetails?: () => void }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
      <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>Top produits</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {products.map((prod, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#374151' }}>{prod.name}</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{prod.percentage}%</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${prod.percentage}%`, backgroundColor: prod.color, height: '100%', borderRadius: '9999px' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{prod.count} contrats</span>
              <span style={{ fontSize: '12px', color: '#10b981' }}>{prod.growth}</span>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={onViewDetails}
        style={{
          marginTop: '16px',
          width: '100%',
          textAlign: 'center',
          fontSize: '14px',
          color: '#3b82f6',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '8px'
        }}
      >
        Voir détails complets
      </button>
    </div>
  );
}