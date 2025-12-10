import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { InstallBanner } from './InstallBanner';

export function Layout() {
  const { theme } = useAppStore();
  const location = useLocation();
  const [key, setKey] = useState(0);

  // Aplicar tema ao documento
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // CORREÇÃO: Disparar evento E forçar re-render ao trocar de rota
  useEffect(() => {
    // Disparar evento customizado
    const event = new CustomEvent('route-changed', {
      detail: { pathname: location.pathname }
    });
    window.dispatchEvent(event);
    
    // Forçar re-render do Outlet
    setKey(prev => prev + 1);
    
    console.log(' Rota mudou:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar />

      <main className="lg:ml-64 pb-16 lg:pb-0">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 py-4 sm:py-5 md:py-6">
          <Outlet key={key} />
        </div>
      </main>

      <BottomNav />
      <InstallBanner />
    </div>
  );
}