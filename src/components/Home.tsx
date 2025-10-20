import { useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Target, BarChart3, Settings, Download, Zap, Heart, Brain, GraduationCap, HelpCircle, Bell, Accessibility, Users, Shield, Smartphone, Menu } from 'lucide-react';
import { Z_INDEX } from '../constants/zIndex';
import { Breadcrumbs } from './Breadcrumbs';
import { Home as HomeIcon } from 'lucide-react';
import { useSimulacao, useUI } from '../store/useAppStore';
import { useToast } from '../hooks/useToast';
import { useNotificacoes } from '../hooks/useNotificacoes';
import { usePreloadComponents, useIntelligentPreload, useHoverPreload } from '../hooks/usePreloadComponents';
import { useOnboarding } from '../hooks/useOnboarding';
import { useContextualTutorials } from './ContextualTutorial';
import { useContextualHelp } from './ContextualHelp';
import { useNotificationSystem } from './NotificationSystem';
import { OnboardingTour } from './OnboardingTour';
import { ContextualTutorial } from './ContextualTutorial';
import { ContextualHelp } from './ContextualHelp';
import { NotificationSystem } from './NotificationSystem';
import { AccessibilityPanel } from './AccessibilityPanel';
import GlobalSettings from './GlobalSettings';
import ProfileManager from './ProfileManager';
import BackupManager from './BackupManager';
import PWAManager from './PWAManager';
import { useProfiles } from '../hooks/useProfiles';
import { FormularioEntrada } from './FormularioEntrada';
import { ResultadoSimulacao } from './ResultadoSimulacao';
import { GraficoInterativo } from './GraficoInterativo';
import { PeriodoVisualizacao } from './PeriodoSwitch';
import { NavigationEnhanced } from './NavigationEnhanced';
import { SkeletonLoader, SkeletonCard, SkeletonChart, SkeletonDashboard } from './SkeletonLoader';
import { LazyWrapper, LazyViewport } from './LazyWrapper';
import { LoadingOverlay } from './LoadingProgress';
import { AnimatedContainer, StaggeredContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import { useJurosCompostos } from '../hooks/useJurosCompostos';
import {
  LazyComparadorInvestimentos,
  LazyHistoricoSimulacoes,
  LazyCalculadoraMeta,
  LazyDashboardMelhorado,
  LazyRecomendacoesIA,
  LazyCalculadoraAposentadoria,
  LazyRetiradasProgramadas,
  LazySimulacaoInflacao,
  LazyAnaliseCenarios,
  LazyAnaliseAvancada,
  LazyDashboardAvancado,
  LazyDashboardPerformance,
  LazyExportacaoAvancada
} from './LazyComponents';
import MetasFinanceiras from './MetasFinanceiras';
import TimelineMetas from './TimelineMetas';
import CalculadoraImpostoRenda from './CalculadoraImpostoRenda';
import SistemaFavoritos from './SistemaFavoritos';
import DashboardInsights from './DashboardInsights';
import SimuladorCenarios from './SimuladorCenarios';
import SistemaEducacao from './SistemaEducacao';
import Sidebar from './Sidebar';

export const Home = memo(() => {
  const { success, error, info } = useToast();
  const { 
    verificarMetasProximas, 
    verificarOportunidadesMercado, 
    criarLembreteAporte, 
    verificarPerformance 
  } = useNotificacoes();
  
  // Hooks de preload para melhorar performance
  usePreloadComponents();
  const { registerNavigation } = useIntelligentPreload();
  const hoverPreload = useHoverPreload();
  
  // Hook de onboarding
  const {
    isActive: isOnboardingActive,
    currentTour,
    startTour,
    completeTour,
    skipTour,
    hasCompletedTour
  } = useOnboarding();

  // Hooks dos novos sistemas
  const {
    activeTutorial,
    startTutorial,
    completeTutorial,
    skipTutorial,
    closeTutorial,
    isCompleted: isTutorialCompleted,
    refreshCompletedTutorials
  } = useContextualTutorials();

  const {
    isHelpOpen,
    helpContext,
    openHelp,
    closeHelp
  } = useContextualHelp();

  const {
    notifications,
    settings: notificationSettings,
    addNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    updateSettings: updateNotificationSettings
  } = useNotificationSystem();

  const { currentProfile } = useProfiles();

  // Estado para controlar painéis
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [showBackupManager, setShowBackupManager] = useState(false);
  const [showPWAManager, setShowPWAManager] = useState(false);
  
  // Estado para período de visualização
  const [periodoVisualizacao, setPeriodoVisualizacao] = useState<PeriodoVisualizacao>('anual');
  
  // Estado global do Zustand
  const {
    simulacao,
    setSimulacao,
    resultado,
    setResultado,
    isLoading,
    setLoading
  } = useSimulacao();
  
  const {
    activeTab,
    setActiveTab
  } = useUI();

  // Estado local para controlar modais
  const [modals, setModals] = useState({
    showInflacao: false,
    showCenarios: false,
    showAnaliseAvancada: false,
    showDashboard: false,
    showPerformance: false,
    showExportacao: false
  });

  // Estado derivado para verificar se há resultado calculado
  const calculado = Boolean(resultado && resultado.saldoFinal > 0);
  
  const resultadoCalculado = useJurosCompostos(simulacao);

  // Efeito para sincronizar estados de tutorial na inicialização
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshCompletedTutorials();
    }, 100);
    return () => clearTimeout(timer);
  }, [refreshCompletedTutorials]);

  // Função para abrir/fechar modais
  const toggleModal = useCallback((modalName: keyof typeof modals) => {
    setModals(prev => ({
      ...prev,
      [modalName]: !prev[modalName]
    }));
  }, []);

  // Função melhorada para mudança de aba com preload
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    registerNavigation(`/${tabId}`);
    
    // Preload baseado na aba selecionada
    switch (tabId) {
      case 'comparador':
        hoverPreload.preloadRelatorios();
        break;
      case 'historico':
        hoverPreload.preloadDashboard();
        break;
      case 'meta':
        hoverPreload.preloadSimulador();
        break;
      case 'recomendacoes':
        hoverPreload.preloadRecomendacoes();
        break;
      case 'cenarios':
        hoverPreload.preloadSimulador();
        break;
      case 'educacao':
        hoverPreload.preloadEducacao();
        break;
    }
  }, [setActiveTab, registerNavigation, hoverPreload]);

  const handleCalcular = async () => {
    setLoading(true);
    info('Calculando...', 'Processando sua simulação de juros compostos');
    
    try {
      // Simular um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 500));
      setResultado(resultadoCalculado);
      success('Cálculo concluído!', 'Sua simulação foi processada com sucesso');
      
      // Adicionar notificação de sucesso
      addNotification({
        title: 'Simulação Concluída',
        message: `Seu investimento pode render R$ ${resultadoCalculado.saldoFinal.toLocaleString('pt-BR')} em ${simulacao.periodo} meses`,
        type: 'success',
        priority: 'medium',
        category: 'simulacao',
        actionLabel: 'Ver Detalhes',
        actionUrl: '#resultado'
      });
    } catch (err) {
      error('Erro no cálculo', 'Ocorreu um erro ao processar sua simulação');
      
      // Adicionar notificação de erro
      addNotification({
        title: 'Erro na Simulação',
        message: 'Não foi possível processar sua simulação. Tente novamente.',
        type: 'error',
        priority: 'high',
        category: 'sistema'
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para iniciar tutorial contextual
  const startContextualTutorial = (tutorialType: string) => {
    const tutorials = {
      'simulacao-basica': {
        id: 'simulacao-basica',
        title: 'Tutorial: Simulação Básica',
        description: 'Aprenda a fazer sua primeira simulação',
        category: 'beginner' as const,
        estimatedTime: 5,
        steps: [
          {
            id: 'step-1',
            title: 'Valor Inicial',
            content: 'Digite o valor que você tem para investir inicialmente',
            target: '[data-tutorial="valor-inicial"]',
            position: 'bottom' as const,
            highlight: true,
            tips: ['Use valores realistas', 'Considere sua reserva de emergência']
          },
          {
            id: 'step-2',
            title: 'Aporte Mensal',
            content: 'Defina quanto você pode investir mensalmente',
            target: '[data-tutorial="aporte-mensal"]',
            position: 'bottom' as const,
            highlight: true,
            tips: ['Seja consistente', 'Comece com valores menores se necessário']
          },
          {
            id: 'step-3',
            title: 'Taxa de Juros',
            content: 'Escolha uma taxa de juros realista para seu investimento',
            target: '[data-tutorial="taxa-juros"]',
            position: 'bottom' as const,
            highlight: true,
            tips: ['CDI atual: ~13% ao ano', 'Renda fixa: 10-14% ao ano', 'Renda variável: histórico de 15% ao ano']
          },
          {
            id: 'step-4',
            title: 'Período',
            content: 'Defina por quanto tempo você vai investir',
            target: '[data-tutorial="periodo"]',
            position: 'bottom' as const,
            highlight: true,
            tips: ['Quanto mais tempo, maior o efeito dos juros compostos']
          },
          {
            id: 'step-5',
            title: 'Calcular',
            content: 'Clique em calcular para ver os resultados',
            target: '[data-tutorial="calcular"]',
            position: 'top' as const,
            highlight: true,
            action: 'click' as const
          }
        ]
      }
    };

    const tutorial = tutorials[tutorialType as keyof typeof tutorials];
    if (tutorial) {
      startTutorial(tutorial);
    }
  };

  // Função para abrir ajuda contextual
  const openContextualHelp = (context?: string) => {
    openHelp(context || activeTab);
  };

  // Função para lidar com ações de notificação
  const handleNotificationAction = (notification: any) => {
    if (notification.actionUrl === '#resultado') {
      // Scroll para o resultado
      const resultElement = document.getElementById('resultado-simulacao');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    markAsRead(notification.id);
  };

  // Efeito para gerar notificações inteligentes baseadas nos resultados
  useEffect(() => {
    if (resultado && resultado.saldoFinal) {
      // Verificar oportunidades de mercado (comparar com taxa média de 10% ao ano)
      const taxaMedia = 10;
      const taxaAtual = 10; // Usar uma taxa padrão por enquanto
      verificarOportunidadesMercado(taxaAtual, taxaMedia);

      // Verificar performance (comparar rendimento real vs esperado)
      const rendimentoEsperado = simulacao.valorInicial * Math.pow(1 + taxaMedia/100, simulacao.periodo/12);
      verificarPerformance(resultado.saldoFinal, rendimentoEsperado);

      // Criar lembrete de aporte se o valor mensal for baixo
      if (simulacao.valorMensal < 1000) {
        const valorSugerido = Math.min(simulacao.valorMensal * 1.5, 2000);
        criarLembreteAporte(valorSugerido);
        
        // Adicionar notificação de sugestão
        addNotification({
          title: 'Sugestão de Aporte',
          message: `Considere aumentar seu aporte para R$ ${valorSugerido.toLocaleString('pt-BR')} para acelerar seus resultados`,
          type: 'info',
          priority: 'medium',
          category: 'sugestao',
          actionLabel: 'Ver Tutorial',
          actionUrl: '#tutorial-aporte'
        });
      }

      // Verificar metas próximas (simular uma meta de R$ 100.000)
      const metaSimulada = 100000;
      const mesesRestantes = Math.max(0, 60 - simulacao.periodo); // Meta de 5 anos
      verificarMetasProximas(resultado.saldoFinal, metaSimulada, mesesRestantes);

      // Notificação de conquista se atingir meta
      if (resultado.saldoFinal >= metaSimulada) {
        addNotification({
          title: 'Meta Atingida! 🎉',
          message: 'Parabéns! Sua simulação atingiu a meta de R$ 100.000',
          type: 'success',
          priority: 'high',
          category: 'conquista',
          sound: true,
          vibration: true
        });
      }
    }
  }, [resultado, simulacao, verificarMetasProximas, verificarOportunidadesMercado, criarLembreteAporte, verificarPerformance, addNotification]);

  // Efeito para mostrar tutorial para novos usuários
  useEffect(() => {
    if (!hasCompletedTour('welcome') && !isOnboardingActive && !isTutorialCompleted('simulacao-basica')) {
      // Mostrar tutorial após 2 segundos para novos usuários
      const timer = setTimeout(() => {
        if (activeTab === 'simulacao') {
          startContextualTutorial('simulacao-basica');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, hasCompletedTour, isOnboardingActive, isTutorialCompleted]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActiveTab('simulacao');
            break;
          case '2':
            event.preventDefault();
            setActiveTab('comparador');
            break;
          case '3':
            event.preventDefault();
            setActiveTab('historico');
            break;
          case '4':
            event.preventDefault();
            setActiveTab('meta');
            break;
          case 'h':
            event.preventDefault();
            openContextualHelp();
            break;
          case 'n':
             event.preventDefault();
             setShowNotifications(!showNotifications);
             break;
           case 'a':
             event.preventDefault();
             setShowAccessibility(!showAccessibility);
             break;
           case 's':
             if (event.ctrlKey) {
               event.preventDefault();
               setShowGlobalSettings(!showGlobalSettings);
             }
             break;
           case 'p':
             if (event.ctrlKey) {
               event.preventDefault();
               setShowProfileManager(!showProfileManager);
             }
             break;
          case 'b':
            if (event.ctrlKey) {
              event.preventDefault();
              setShowBackupManager(!showBackupManager);
            }
            break;
          case 'Enter':
            if (activeTab === 'simulacao' && !isLoading) {
              event.preventDefault();
              handleCalcular();
            }
            break;
        }
      }
      
      // Tecla F1 para ajuda
      if (event.key === 'F1') {
        event.preventDefault();
        openContextualHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
       return () => window.removeEventListener('keydown', handleKeyDown);
     }, [activeTab, isLoading, setActiveTab, showNotifications, showAccessibility, showGlobalSettings, showProfileManager, showBackupManager, openContextualHelp]);

  const tabs = [
    { id: 'simulacao', label: 'Simulação', icon: Calculator },
    { id: 'comparador', label: 'Comparador', icon: BarChart3 },
    { id: 'historico', label: 'Histórico', icon: TrendingUp },
    { id: 'meta', label: 'Calculadora de Meta', icon: Target },
    { id: 'metas-financeiras', label: 'Metas Financeiras', icon: Target },
    { id: 'imposto-renda', label: 'Imposto de Renda', icon: Calculator },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'cenarios', label: 'Cenários', icon: Settings },
    { id: 'educacao', label: 'Educação', icon: GraduationCap },
    { id: 'recomendacoes', label: 'IA Recomendações', icon: Zap },
    { id: 'aposentadoria', label: 'Aposentadoria', icon: Target }
  ];

  const quickActions = [
    {
      title: 'Simulação Rápida',
      description: 'Calcule seus juros compostos em segundos',
      icon: Calculator,
      action: () => setActiveTab('simulacao'),
      color: 'from-blue-500 to-blue-600',
      shortcut: 'Ctrl+1'
    },
    {
      title: 'Comparar Investimentos',
      description: 'Compare diferentes opções de investimento',
      icon: BarChart3,
      action: () => setActiveTab('comparador'),
      color: 'from-green-500 to-green-600',
      shortcut: 'Ctrl+2'
    },
    {
      title: 'Análise de Cenários',
      description: 'Simule diferentes cenários econômicos',
      icon: Settings,
      action: () => setActiveTab('cenarios'),
      color: 'from-purple-500 to-purple-600',
      shortcut: 'Ctrl+3'
    },
    {
      title: 'Recomendações IA',
      description: 'Receba sugestões personalizadas',
      icon: Zap,
      action: () => setActiveTab('recomendacoes'),
      color: 'from-orange-500 to-orange-600',
      shortcut: 'Ctrl+4'
    }
  ];

  // Breadcrumbs melhorados
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ 
      label: 'Início', 
      path: 'home',
      icon: <HomeIcon className="w-4 h-4" />
    }];
    
    const tabLabels: Record<string, string> = {
      simulacao: 'Simulação',
      comparador: 'Comparador',
      historico: 'Histórico',
      meta: 'Calculadora de Meta',
      'metas-financeiras': 'Metas Financeiras',
      'imposto-renda': 'Imposto de Renda',
      favoritos: 'Favoritos',
      insights: 'Insights',
      performance: 'Performance',
      cenarios: 'Cenários',
      educacao: 'Educação Financeira',
      recomendacoes: 'IA Recomendações',
      aposentadoria: 'Aposentadoria'
    };

    if (activeTab && tabLabels[activeTab]) {
      breadcrumbs.push({ label: tabLabels[activeTab], path: activeTab });
    }

    return breadcrumbs;
  };

  // Handler para navegação dos breadcrumbs
  const handleBreadcrumbClick = (item: { label: string; path: string; icon?: React.ReactNode }) => {
    if (item.path === 'home') {
      setActiveTab('simulacao');
    } else {
      setActiveTab(item.path as any);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Responsivo e Fixo */}
      <header 
        className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 z-50"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto h-12 sm:h-14">
          {/* Lado Esquerdo - Logo e Menu */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Botão Menu Sidebar */}
            <motion.button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Menu (Ctrl+B)"
              aria-label="Abrir menu lateral"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>

            {/* Logo/Título */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calculator className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h1 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                <span className="hidden sm:inline">Jurus</span>
                <span className="sm:hidden">J</span>
              </h1>
            </div>
          </div>

          {/* Lado Direito - Perfil e Notificações */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Botão de Notificações */}
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Notificações (Ctrl+N)"
              aria-label="Abrir notificações"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
              {notifications.filter(n => !n.read && !n.archived).length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications.filter(n => !n.read && !n.archived).length}
                </span>
              )}
            </motion.button>

            {/* Perfil do Usuário */}
            {currentProfile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileManager(!showProfileManager)}
                className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-0"
                title={`Perfil: ${currentProfile.name} (Ctrl+P)`}
                aria-label={`Perfil de ${currentProfile.name}`}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0">
                  {currentProfile.avatar || currentProfile.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 max-w-16 lg:max-w-20 truncate">
                  {currentProfile.name}
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={showSidebar}
        onToggle={() => setShowSidebar(!showSidebar)}
        onAccessibilityClick={() => {
          setShowAccessibility(!showAccessibility);
          setShowSidebar(false);
        }}
        onGlobalSettingsClick={() => {
          setShowGlobalSettings(!showGlobalSettings);
          setShowSidebar(false);
        }}
        onBackupClick={() => {
          setShowBackupManager(!showBackupManager);
          setShowSidebar(false);
        }}
        onTutorialClick={() => {
          startContextualTutorial('simulacao-basica');
          setShowSidebar(false);
        }}
        onHelpClick={() => {
          openContextualHelp();
          setShowSidebar(false);
        }}
      />

      {/* Navigation Tabs - Completamente Responsivo */}
      <nav 
        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-14 sm:top-16 w-full z-10"
        style={{ zIndex: Z_INDEX.NAVIGATION }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
            {/* Breadcrumbs Melhorados */}
            <div className="py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
              <Breadcrumbs
                items={getBreadcrumbs()}
                maxItems={3}
                onItemClick={handleBreadcrumbClick}
                className="w-full"
              />
            </div>

            {/* Enhanced Navigation - Container Totalmente Responsivo */}
            <div className="py-2 sm:py-3 lg:py-4">
              <div className="w-full overflow-hidden">
                <MemoizedNavigationEnhanced 
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    setActiveTab(tab as any);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Adicionado padding-top para compensar header fixo */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 pt-28 sm:pt-32 lg:pt-36">
        {/* Welcome Section - Only show when no tab is active or on simulacao */}
        {activeTab === 'simulacao' && !resultado && (
          <AnimatedContainer variant="fadeIn" className="mb-8">
            <div className="text-center mb-12">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Calculadora de Juros Compostos
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Descubra o poder dos juros compostos e planeje seu futuro financeiro com nossa plataforma completa de simulações e análises.
              </motion.p>
            </div>

            {/* Quick Actions */}
            <StaggeredContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {quickActions.map((action, index) => (
                <AnimatedItem key={action.title}>
                  <motion.div
                    className={`relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${action.color} text-white cursor-pointer group overflow-hidden`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    title={`${action.title} (${action.shortcut})`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <action.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 relative z-10" />
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 relative z-10">{action.title}</h3>
                    <p className="text-xs sm:text-sm opacity-90 relative z-10">{action.description}</p>
                    <div className="text-xs opacity-75 mt-1 sm:mt-2 relative z-10 hidden sm:block">{action.shortcut}</div>
                  </motion.div>
                </AnimatedItem>
              ))}
            </StaggeredContainer>
          </AnimatedContainer>
        )}

        {/* Tab Content */}
        <AnimatedContainer
          key={activeTab}
          variant="fadeIn"
          duration={0.4}
        >
          {activeTab === 'simulacao' && (
            <StaggeredContainer 
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
              staggerDelay={0.15}
              initialDelay={0.1}
            >
              <AnimatedItem className="space-y-4 sm:space-y-6">
                <MemoizedFormularioEntrada
                  simulacao={simulacao}
                  onSimulacaoChange={setSimulacao}
                  onCalcular={handleCalcular}
                  isLoading={isLoading}
                />
              </AnimatedItem>
              
              <AnimatedItem className="space-y-4 sm:space-y-6">
                {isLoading ? (
                  <StaggeredContainer staggerDelay={0.1}>
                    <AnimatedItem>
                      <SkeletonCard />
                    </AnimatedItem>
                    <AnimatedItem>
                      <SkeletonChart />
                    </AnimatedItem>
                  </StaggeredContainer>
                ) : resultado ? (
                  <LoadingOverlay loadingState={{ isLoading: false, error: null }}>
                    <StaggeredContainer staggerDelay={0.2}>
                      <AnimatedItem>
                        <MemoizedResultadoSimulacao 
                          resultado={resultado} 
                          simulacao={simulacao}
                          periodoVisualizacao={periodoVisualizacao}
                          onPeriodoChange={setPeriodoVisualizacao}
                        />
                      </AnimatedItem>
                      <AnimatedItem>
                        <MemoizedGraficoInterativo 
                          dados={resultado.evolucaoMensal} 
                          periodoVisualizacao={periodoVisualizacao}
                        />
                      </AnimatedItem>
                    </StaggeredContainer>
                  </LoadingOverlay>
                ) : null}
              </AnimatedItem>
            </StaggeredContainer>
          )}

          {activeTab === 'comparador' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <LazyWrapper fallback={<SkeletonChart />}>
                <LazyComparadorInvestimentos 
                  comparacoes={[]}
                  simulacaoAtual={simulacao}
                  onAdicionarComparacao={() => {}}
                  onRemoverComparacao={() => {}}
                  onLimparComparacoes={() => {}}
                />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'historico' && (
            <AnimatedContainer variant="slideLeft" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyHistoricoSimulacoes 
                  onCarregarSimulacao={(item) => setSimulacao(item.simulacao)}
                  onFechar={() => setActiveTab('simulacao')}
                />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'meta' && (
            <AnimatedContainer variant="scale" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyCalculadoraMeta 
                  onFechar={() => setActiveTab('simulacao')}
                />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'performance' && (
            <AnimatedContainer variant="fadeIn" delay={0.1}>
              <LazyWrapper fallback={<SkeletonChart />}>
                <LazyDashboardMelhorado 
                  valorAtual={resultado?.saldoFinal || 0}
                  valorInicial={simulacao.valorInicial}
                />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'cenarios' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyAnaliseCenarios
                  simulacao={simulacao}
                  onClose={() => setActiveTab('simulacao')}
                />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'recomendacoes' && (
            <AnimatedContainer variant="fadeIn" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyRecomendacoesIA 
                  simulacao={simulacao}
                />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'aposentadoria' && (
            <AnimatedContainer variant="slideRight" delay={0.1}>
              <LazyWrapper fallback={<SkeletonCard />}>
                <LazyCalculadoraAposentadoria />
              </LazyWrapper>
            </AnimatedContainer>
          )}

          {activeTab === 'metas-financeiras' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <MetasFinanceiras />
            </AnimatedContainer>
          )}

          {activeTab === 'imposto-renda' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <CalculadoraImpostoRenda />
            </AnimatedContainer>
          )}

          {activeTab === 'favoritos' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <SistemaFavoritos />
            </AnimatedContainer>
          )}

          {activeTab === 'insights' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <DashboardInsights />
            </AnimatedContainer>
          )}

          {activeTab === 'educacao' && (
            <AnimatedContainer variant="slideUp" delay={0.1}>
              <SistemaEducacao />
            </AnimatedContainer>
          )}
        </AnimatedContainer>
      </main>

      {/* PWA Manager */}
      <PWAManager
        isOpen={showPWAManager}
        onClose={() => setShowPWAManager(false)}
      />

      {/* Modals */}
      {modals.showInflacao && calculado && (
        <LazyWrapper fallback={<SkeletonCard />}>
          <LazySimulacaoInflacao
            valorInicial={simulacao.valorInicial}
            valorMensal={simulacao.valorMensal}
            periodo={simulacao.periodo}
            taxaJuros={simulacao.modalidade?.taxaAnual || 0}
            onClose={() => toggleModal('showInflacao')}
          />
        </LazyWrapper>
      )}

      {modals.showCenarios && calculado && (
        <LazyWrapper fallback={<SkeletonCard />}>
          <LazyAnaliseCenarios
            simulacao={simulacao}
            onClose={() => toggleModal('showCenarios')}
          />
        </LazyWrapper>
      )}

      {modals.showAnaliseAvancada && calculado && (
        <LazyWrapper fallback={<SkeletonCard />}>
          <LazyAnaliseAvancada
            simulacao={simulacao}
            onClose={() => toggleModal('showAnaliseAvancada')}
          />
        </LazyWrapper>
      )}

      {modals.showDashboard && calculado && (
        <LazyWrapper fallback={<SkeletonChart />}>
          <LazyDashboardAvancado
            simulacao={simulacao}
            resultado={resultado}
            onClose={() => toggleModal('showDashboard')}
          />
        </LazyWrapper>
      )}

      {modals.showPerformance && calculado && (
        <LazyWrapper fallback={<SkeletonChart />}>
          <LazyDashboardPerformance
            valorAtual={resultado?.saldoFinal || 0}
            valorInicial={simulacao.valorInicial}
          />
        </LazyWrapper>
      )}

      {modals.showExportacao && calculado && (
        <LazyWrapper fallback={<SkeletonCard />}>
          <LazyExportacaoAvancada
            simulacao={simulacao}
            resultado={resultado}
            onClose={() => toggleModal('showExportacao')}
          />
        </LazyWrapper>
      )}

      {/* Sistemas de Tutorial, Ajuda e Notificações */}
       <ContextualTutorial
         tutorial={activeTutorial}
         isActive={!!activeTutorial}
         onComplete={() => {
           if (activeTutorial) {
             // Garantir que o tutorial seja marcado como completado
             completeTutorial(activeTutorial.id);
             
             // Forçar uma atualização do estado para garantir persistência
             setTimeout(() => {
               refreshCompletedTutorials();
             }, 50);
             
             addNotification({
               title: 'Tutorial Concluído! 🎓',
               message: `Você completou o tutorial "${activeTutorial.title}"`,
               type: 'success',
               priority: 'medium',
               category: 'educacao'
             });
           }
         }}
         onSkip={() => {
           skipTutorial();
           addNotification({
             title: 'Tutorial Ignorado',
             message: 'Você pode acessar tutoriais a qualquer momento na central de ajuda',
             type: 'info',
             priority: 'low',
             category: 'educacao'
           });
         }}
         onClose={closeTutorial}
         autoPlay={false}
         showProgress={true}
       />

       <ContextualHelp
         isOpen={isHelpOpen}
         onClose={closeHelp}
         context={helpContext}
       />

       <NotificationSystem
         isOpen={showNotifications}
         onClose={() => setShowNotifications(false)}
         notifications={notifications}
         onMarkAsRead={markAsRead}
         onMarkAllAsRead={markAllAsRead}
         onArchive={archiveNotification}
         onDelete={deleteNotification}
         onAction={handleNotificationAction}
         settings={notificationSettings}
         onUpdateSettings={updateNotificationSettings}
       />

       <AccessibilityPanel
         isOpen={showAccessibility}
         onClose={() => setShowAccessibility(false)}
       />

       <GlobalSettings
          isOpen={showGlobalSettings}
          onClose={() => setShowGlobalSettings(false)}
        />

         <ProfileManager
           isOpen={showProfileManager}
           onClose={() => setShowProfileManager(false)}
         />

         <BackupManager
           isOpen={showBackupManager}
           onClose={() => setShowBackupManager(false)}
         />

        {/* Onboarding Tour (mantido para compatibilidade) */}
       {isOnboardingActive && currentTour && (
         <OnboardingTour
           steps={currentTour.steps}
           isActive={isOnboardingActive}
           onComplete={() => {
             completeTour();
             addNotification({
               title: 'Bem-vindo ao Jurus! 🚀',
               message: 'Você completou o tour de boas-vindas. Explore todas as funcionalidades!',
               type: 'success',
               priority: 'medium',
               category: 'onboarding'
             });
           }}
           onSkip={() => {
             skipTour();
             addNotification({
               title: 'Tour Ignorado',
               message: 'Você pode refazer o tour a qualquer momento nas configurações',
               type: 'info',
               priority: 'low',
               category: 'onboarding'
             });
           }}
         />
       )}
     </div>
   );
 });

// Memoizar componentes para otimizar performance
const MemoizedFormularioEntrada = memo(FormularioEntrada);
const MemoizedResultadoSimulacao = memo(ResultadoSimulacao);
const MemoizedGraficoInterativo = memo(GraficoInterativo);
const MemoizedNavigationEnhanced = memo(NavigationEnhanced);

export default Home;