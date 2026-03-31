'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useNavigationStore } from '@/store/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/components/pages/LoginPage';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { BoilingPage } from '@/components/pages/BoilingPage';
import { PackagingPage } from '@/components/pages/PackagingPage';
import { SeparationPage } from '@/components/pages/SeparationPage';
import { ReportsPage } from '@/components/pages/ReportsPage';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { currentPage } = useNavigationStore();

  // Rehydrate auth token on mount
  useEffect(() => {
    // Zustand persist handles rehydration automatically
  }, []);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Render the appropriate page based on current navigation state
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'boiling':
        return <BoilingPage />;
      case 'packaging':
        return <PackagingPage />;
      case 'separation':
        return <SeparationPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <AppLayout>{renderPage()}</AppLayout>;
}
