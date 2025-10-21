// Página principal de Educação Financeira

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  ChartPie, 
  BookOpen,
  ArrowRight,
  CreditCard,
  Coins,
  X,
  ChevronRight,
  Home
} from 'lucide-react';

// Lazy loading para componentes pesados
// Removed unused lazy imports: Assessment, RetirementCalculator, InvestmentComparator, LoanCalculator, ContentLibrary


import { Header } from '../components/Header';
import { useEducacaoFinanceira } from '../hooks/useEducacaoFinanceira';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

// Import existing components
import SistemaEducacao from '../components/SistemaEducacao';
import { Simulador5030 } from '../components/educacao/Simulador5030';
import { SolucoesDividas } from '../components/educacao/SolucoesDividas';
import { CofrinhoInteligente as CofrinhoVirtual } from '../components/educacao/CofrinhoInteligente';

// Import new gamification components
// Gamification components removed

// Import new progress panel components
// Removed unused progress components imports



// Import new assessment components
// Removed unused assessment components imports

// Import new calculator components
// InvestmentComparator is lazy loaded above

// Import new content components
// Removed unused content components imports

// Import new certification components
// Certificate components removed

// Import hooks
import { useEducationProgress } from '../hooks/useEducationProgress';
// Removed unused useAssessment hook import

// Import UI components
import { useNotifications, NotificationContainer } from '../components/ui/notification';
import { useFeedback, Feedback } from '../components/ui/feedback';

export default function EducacaoFinanceira() {
  const {
    statistics,
    sections
  } = useEducacaoFinanceira();

  const { currentModule } = useEducationProgress();
  
  // UI feedback hooks
  const { notifications, removeNotification, success, achievement, info } = useNotifications();
  const { feedback, hideFeedback } = useFeedback();

  const [selectedContent, setSelectedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSection, setActiveSection] = useState('overview');


  // Mapeamento de ícones - apenas os necessários para os 4 cards
  const iconMap = {
    GraduationCap,
    ChartPie,
    CreditCard,
    Coins,
    BookOpen
  };

  // Seções expandidas da página - mantendo apenas os 4 cards especificados
  const expandedSections = sections;

  // Abas principais da interface
  const mainTabs = [
    { id: 'overview', label: 'Visão Geral', icon: Home }
  ];

  useEffect(() => {
    // Scroll suave para a seção ativa
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  // Função para navegar entre seções com feedback
  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const section = expandedSections.find(s => s.id === sectionId);
    if (section) {
      info(`Navegando para: ${section.title}`, 'Seção alterada');
    }
  };

  // Função para navegar entre abas com feedback
  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    const tab = mainTabs.find(t => t.id === tabId);
    if (tab) {
      info(`Aba ativa: ${tab.label}`, 'Navegação atualizada');
    }
  };



  // Componente de loading
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Carregando...</span>
    </div>
  );

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'educacao':
        return <SistemaEducacao />;
      case 'simulador':
        return <Simulador5030 />;
      case 'dividas':
        return <SolucoesDividas />;
      case 'cofrinho':
        return <CofrinhoVirtual />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Painel de Progresso
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe seu progresso e desempenho nos estudos financeiros.
            </p>
          </div>
        );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Quick Access Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expandedSections.slice(0, 6).map((section, index) => {
                const IconComponent = iconMap[section.icon] || BookOpen;
                
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-6 h-full transition-all duration-300 hover:shadow-xl border-2 hover:border-blue-300 dark:hover:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500">
                      <button 
                        onClick={() => navigateToSection(section.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigateToSection(section.id);
                          }
                        }}
                        aria-label={`Navegar para ${section.title}: ${section.description}`}
                        className="h-full w-full flex flex-col text-left focus:outline-none"
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {section.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                          {section.description}
                        </p>
                        
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                          Explorar
                          <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                        </div>
                      </button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      

      
      default:
        return renderSectionContent(activeSection);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Educação Financeira
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Desenvolva suas habilidades financeiras com ferramentas interativas, 
            simuladores práticos e conteúdo educativo de qualidade.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <nav 
            role="tablist" 
            aria-label="Navegação principal da educação financeira"
            className="flex flex-wrap justify-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            {mainTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onClick={() => navigateToTab(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigateToTab(tab.id);
                    }
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${activeTab === tab.id 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {/* Active Section Content */}
        <AnimatePresence mode="wait">
          {activeSection && activeSection !== activeTab && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
              id={activeSection}
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <ChevronRight className="w-5 h-5 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {expandedSections.find(s => s.id === activeSection)?.title || 'Seção Ativa'}
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigateToSection('')}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {renderSectionContent(activeSection)}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          

        </AnimatePresence>
      </main>

      {/* Notification System */}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
        position="top-right"
      />

      {/* Feedback System */}
      {feedback && (
        <Feedback
          type={feedback.type}
          message={feedback.message}
          isVisible={feedback.isVisible}
          onClose={hideFeedback}
        />
      )}
    </div>
  );
}