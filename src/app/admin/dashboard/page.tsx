// src/app/admin/dashboard/page.tsx
'use client';

import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { PremiumChart } from './components/PremiumChart';
import { TopProducts } from './components/TopProducts';
import { RecentActivities } from './components/RecentActivities';
import { PendingRequests } from './components/PendingRequests';
import { StatsCards } from './components/StatsCards';
import { TeamsPerformance } from './components/TeamsPerformance';
import { useDashboardData } from './hooks/useDashboardData';

export default function DashboardPage() {
  const {
    isLoading,
    notifications,
    kpis,
    activities,
    products,
    requests,
    teams,
    monthlyData,
    refreshData,
  } = useDashboardData();

  const handleExport = () => console.log('Export...');
  const handleViewAll = (section: string) => console.log(`View all: ${section}`);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Header 
        onRefresh={refreshData} 
        isLoading={isLoading} 
        notifications={notifications}
      />
      
      <main style={{ padding: '24px' }}>
        <KPICards kpis={kpis} />
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '24px',
          marginTop: '24px',
          marginBottom: '24px'
        }}>
          <PremiumChart data={monthlyData} />
          <TopProducts products={products} onViewDetails={() => handleViewAll('products')} />
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '24px',
          marginBottom: '24px'
        }}>
          <RecentActivities activities={activities} onViewAll={() => handleViewAll('activities')} />
          <PendingRequests 
            requests={requests} 
            onFilter={() => console.log('Filter')}
            onViewAll={() => handleViewAll('requests')}
          />
        </div>
        
        <StatsCards />
        <TeamsPerformance teams={teams} onViewRanking={() => handleViewAll('ranking')} />
      </main>
    </div>
  );
}