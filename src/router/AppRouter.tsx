import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Home } from '../components/Home';

// Lazy loading dos componentes
const DashboardExecutivo = lazy(() => import('../components/DashboardExecutivo'));
const DashboardExecutivoAvancado = lazy(() => import('../components/DashboardExecutivoAvancado'));
const RelatoriosAvancados = lazy(() => import('../components/RelatoriosAvancados'));
const RecomendacoesIA = lazy(() => import('../components/RecomendacoesIA'));
const SimuladorCenarios = lazy(() => import('../components/SimuladorCenarios'));
const SistemaTemasAvancado = lazy(() => import('../components/SistemaTemasAvancado'));
const SistemaEducacao = lazy(() => import('../components/SistemaEducacao'));
const CentroNotificacoes = lazy(() => import('../components/CentroNotificacoes'));
const ConfiguracoesAcessibilidade = lazy(() => import('../components/ConfiguracoesAcessibilidade').then(module => ({ default: module.ConfiguracoesAcessibilidade })));

// Componente de Loading
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    </div>
  );
}

// Componente 404
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Página não encontrada
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        A página que você está procurando não existe.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Voltar
      </button>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Rota principal - sem lazy loading para melhor UX inicial */}
          <Route index element={<Home />} />
          
          {/* Dashboard Executivo Básico */}
          <Route 
            path="dashboard" 
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardExecutivo />
              </Suspense>
            } 
          />
          
          {/* Dashboard Executivo */}
          <Route 
            path="dashboard-executivo" 
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardExecutivo />
              </Suspense>
            } 
          />
          
          {/* Dashboard Executivo Avançado */}
          <Route 
            path="dashboard-executivo-avancado" 
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardExecutivoAvancado />
              </Suspense>
            } 
          />
          
          {/* Relatórios Básicos */}
          <Route 
            path="relatorios" 
            element={
              <Suspense fallback={<PageLoader />}>
                <RelatoriosAvancados />
              </Suspense>
            } 
          />
          
          {/* Relatórios Avançados */}
          <Route 
            path="relatorios-avancados" 
            element={
              <Suspense fallback={<PageLoader />}>
                <RelatoriosAvancados />
              </Suspense>
            } 
          />
          
          {/* Recomendações de IA */}
          <Route 
            path="recomendacoes-ia" 
            element={
              <Suspense fallback={<PageLoader />}>
                <RecomendacoesIA />
              </Suspense>
            } 
          />
          
          {/* Simulador de Cenários */}
          <Route 
            path="simulador-cenarios" 
            element={
              <Suspense fallback={<PageLoader />}>
                <SimuladorCenarios />
              </Suspense>
            } 
          />
          
          {/* Sistema de Temas */}
          <Route 
            path="sistema-temas" 
            element={
              <Suspense fallback={<PageLoader />}>
                <div className="min-h-screen bg-gray-50 p-4">
                  <SistemaTemasAvancado onFechar={() => window.history.back()} />
                </div>
              </Suspense>
            } 
          />
          
          {/* Sistema de Educação */}
          <Route 
            path="sistema-educacao" 
            element={
              <Suspense fallback={<PageLoader />}>
                <SistemaEducacao />
              </Suspense>
            } 
          />
          
          {/* Centro de Notificações */}
          <Route 
            path="notificacoes" 
            element={
              <Suspense fallback={<PageLoader />}>
                <CentroNotificacoes />
              </Suspense>
            } 
          />
          
          {/* Configurações de Acessibilidade */}
          <Route 
            path="acessibilidade" 
            element={
              <Suspense fallback={<PageLoader />}>
                <ConfiguracoesAcessibilidade />
              </Suspense>
            } 
          />
          
          {/* Redirecionamentos para compatibilidade */}
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="calculadora" element={<Navigate to="/" replace />} />
          <Route path="dashboard-avancado" element={<Navigate to="/dashboard-executivo-avancado" replace />} />
          <Route path="relatorios" element={<Navigate to="/relatorios-avancados" replace />} />
          <Route path="recomendacoes" element={<Navigate to="/recomendacoes-ia" replace />} />
          <Route path="simulador" element={<Navigate to="/simulador-cenarios" replace />} />
          <Route path="temas" element={<Navigate to="/sistema-temas" replace />} />
          <Route path="educacao" element={<Navigate to="/sistema-educacao" replace />} />
          
          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}