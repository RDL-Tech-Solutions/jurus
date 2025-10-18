import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAppStore } from '../store/useAppStore';

export function Layout() {
  const { configuracoes } = useAppStore();

  // Aplicar tema ao documento
  React.useEffect(() => {
    if (configuracoes.tema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [configuracoes.tema]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Cada página agora gerencia seu próprio header */}
      <main>
        <Outlet />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={configuracoes.tema === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}