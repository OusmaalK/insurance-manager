// src/app/admin/dashboard/components/TeamsPerformance.tsx
'use client';

export function TeamsPerformance({ teams, onViewRanking }: { teams: any[]; onViewRanking?: () => void }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontWeight: '600', color: '#1f2937' }}>Performance des équipes</h3>
        <button onClick={onViewRanking} style={{ fontSize: '14px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
          Voir classement
        </button>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px'
      }}>
        {teams.map((team, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, #3b82f6, #4f46e5)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {team.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>{team.name}</p>
                <span style={{ fontSize: '11px', color: '#10b981' }}>{team.growth}</span>
              </div>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>{team.revenue}</p>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '4px', marginTop: '4px' }}>
                <div style={{ width: `${team.target}%`, backgroundColor: '#3b82f6', height: '4px', borderRadius: '9999px' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}