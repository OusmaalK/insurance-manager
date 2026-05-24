// src/app/admin/dashboard/components/RecentActivities.tsx
'use client';

export function RecentActivities({ activities, onViewAll }: { activities: any[]; onViewAll?: () => void }) {
  const getStatusStyle = (status: string) => {
    const styles: Record<string, any> = {
      validé: { backgroundColor: '#d1fae5', color: '#065f46' },
      'en attente': { backgroundColor: '#fef3c7', color: '#92400e' },
      urgence: { backgroundColor: '#fee2e2', color: '#991b1b' },
      effectué: { backgroundColor: '#dbeafe', color: '#1e40af' },
    };
    return styles[status] || { backgroundColor: '#f3f4f6', color: '#374151' };
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontWeight: '600', color: '#1f2937' }}>Activités récentes</h3>
        <button onClick={onViewAll} style={{ fontSize: '14px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
          Tout voir
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activities.map((activity) => (
          <div key={activity.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: activity.bg, borderRadius: '8px' }}>
              <span style={{ fontSize: '16px' }}>📄</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>{activity.client}</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>•</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{activity.type}</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>{activity.montant}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{activity.produit}</span>
                <span style={{ 
                  fontSize: '10px', 
                  padding: '2px 6px', 
                  borderRadius: '9999px',
                  ...getStatusStyle(activity.status)
                }}>
                  {activity.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <span>⏰</span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Il y a {activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}