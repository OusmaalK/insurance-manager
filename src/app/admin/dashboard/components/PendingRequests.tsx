// src/app/admin/dashboard/components/PendingRequests.tsx
'use client';

export function PendingRequests({ requests, onFilter, onViewAll }: { requests: any[]; onFilter?: () => void; onViewAll?: () => void }) {
  const getPriorityStyle = (priority: string) => {
    const styles: Record<string, any> = {
      haute: { backgroundColor: '#fee2e2', color: '#991b1b' },
      urgente: { backgroundColor: '#fee2e2', color: '#991b1b' },
      moyenne: { backgroundColor: '#fef3c7', color: '#92400e' },
      basse: { backgroundColor: '#f3f4f6', color: '#374151' },
    };
    return styles[priority] || { backgroundColor: '#f3f4f6', color: '#374151' };
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, any> = {
      'À traiter': { backgroundColor: '#fef3c7', color: '#92400e' },
      'En cours': { backgroundColor: '#dbeafe', color: '#1e40af' },
      'Validé': { backgroundColor: '#d1fae5', color: '#065f46' },
      'En attente': { backgroundColor: '#fef3c7', color: '#92400e' },
    };
    return styles[status] || { backgroundColor: '#f3f4f6', color: '#374151' };
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontWeight: '600', color: '#1f2937' }}>Demandes en attente</h3>
        <button onClick={onFilter} style={{ fontSize: '14px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
          Filtrer
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr style={{ textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>
              <th style={{ padding: '12px 20px' }}>Client</th>
              <th style={{ padding: '12px 20px' }}>Type</th>
              <th style={{ padding: '12px 20px' }}>Priorité</th>
              <th style={{ padding: '12px 20px' }}>Statut</th>
              <th style={{ padding: '12px 20px' }}></th>
             </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 20px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{req.client}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af' }}>{req.email}</p>
                  </div>
                 </td>
                <td style={{ padding: '12px 20px', fontSize: '14px', color: '#4b5563' }}>{req.type}</td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '9999px',
                    ...getPriorityStyle(req.priority)
                  }}>
                    {req.priority}
                  </span>
                 </td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '9999px',
                    ...getStatusStyle(req.status)
                  }}>
                    {req.status}
                  </span>
                 </td>
                <td style={{ padding: '12px 20px' }}>
                  <button style={{ fontSize: '12px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Traiter
                  </button>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '12px 20px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
          <span style={{ color: '#6b7280' }}>{requests.length} demandes en attente</span>
          <button onClick={onViewAll} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
            Voir toutes
          </button>
        </div>
      </div>
    </div>
  );
}