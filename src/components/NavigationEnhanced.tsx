import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calculator, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Lightbulb, 
  PiggyBank,
  ChevronRight,
  Keyboard,
  X
} from 'lucide-react';
import { useHoverPreload } from '../hooks/usePreloadComponents';
import { getZIndexClass, Z_INDEX } from '../constants/zIndex';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  description?: string;
}

interface NavigationEnhancedProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onTabHover?: (tab: string) => void;
  className?: string;
  isMinimized?: boolean;
}

const tabs: Tab[] = [
  {
    id: 'simulacao',
    label: 'Simulação',
    icon: <Calculator className="w-4 h-4" />,
    shortcut: '1',
    description: 'Calcular juros compostos'
  },
  {
    id: 'comparador',
    label: 'Comparador',
    icon: <BarChart3 className="w-4 h-4" />,
    shortcut: '2',
    description: 'Comparar investimentos'
  },
  {
    id: 'historico',
    label: 'Histórico',
    icon: <TrendingUp className="w-4 h-4" />,
    shortcut: '3',
    description: 'Histórico de simulações'
  },
  {
    id: 'meta',
    label: 'Metas',
    icon: <Target className="w-4 h-4" />,
    shortcut: '4',
    description: 'Definir metas financeiras'
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <TrendingUp className="w-4 h-4" />,
    shortcut: '5',
    description: 'Dashboard de performance'
  },
  {
    id: 'cenarios',
    label: 'Cenários',
    icon: <Lightbulb className="w-4 h-4" />,
    shortcut: '6',
    description: 'Simulador de cenários'
  },
  {
    id: 'recomendacoes',
    label: 'Recomendações',
    icon: <Lightbulb className="w-4 h-4" />,
    shortcut: '7',
    description: 'Recomendações IA'
  },
  {
    id: 'aposentadoria',
    label: 'Aposentadoria',
    icon: <PiggyBank className="w-4 h-4" />,
    shortcut: '8',
    description: 'Planejamento de aposentadoria'
  }
];

export function NavigationEnhanced({ activeTab, onTabChange, onTabHover, className = '', isMinimized = false }: NavigationEnhancedProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const hoverPreload = useHoverPreload();
  
  // Refs para os containers de navegação
  const mobileNavRef = useRef<HTMLElement>(null);
  const tabletNavRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);

  // Função melhorada para scroll horizontal com mouse wheel
  const handleWheelScroll = useCallback((e: WheelEvent) => {
    // Verificar se o scroll é horizontal ou se deve ser convertido
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // Scroll horizontal nativo
      return;
    }
    
    // Converter scroll vertical em horizontal
    e.preventDefault();
    const container = e.currentTarget as HTMLElement;
    
    // Verificar se há conteúdo para fazer scroll
    if (container.scrollWidth <= container.clientWidth) {
      return;
    }
    
    const scrollAmount = e.deltaY * 0.8; // Multiplicador para suavizar
    container.scrollLeft += scrollAmount;
    
    // Debug log
    console.log('Scroll horizontal aplicado:', {
      deltaY: e.deltaY,
      scrollAmount,
      newScrollLeft: container.scrollLeft,
      scrollWidth: container.scrollWidth,
      clientWidth: container.clientWidth
    });
  }, []);

  // Função para detectar scroll da página
  const handlePageScroll = useCallback(() => {
    const newScrollY = window.scrollY;
    setScrollY(newScrollY);
    
    // Debug log
    console.log('Page scroll detectado:', {
      scrollY: newScrollY,
      shouldMinimize: newScrollY > 100
    });
  }, []);

  // Effect para detectar mobile e adicionar listeners de scroll
  useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 768;
      setIsMobile(isMobileNow);
      console.log('Mobile check:', isMobileNow);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handlePageScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, [handlePageScroll]);

  // Effect melhorado para adicionar event listeners de scroll horizontal
  useEffect(() => {
    const addWheelListeners = () => {
      const refs = [
        { ref: mobileNavRef, name: 'mobile' },
        { ref: tabletNavRef, name: 'tablet' },
        { ref: desktopNavRef, name: 'desktop' }
      ];
      
      refs.forEach(({ ref, name }) => {
        if (ref.current) {
          console.log(`Adicionando wheel listener para ${name} nav`);
          ref.current.addEventListener('wheel', handleWheelScroll, { passive: false });
        }
      });

      return () => {
        refs.forEach(({ ref, name }) => {
          if (ref.current) {
            console.log(`Removendo wheel listener para ${name} nav`);
            ref.current.removeEventListener('wheel', handleWheelScroll);
          }
        });
      };
    };

    // Adicionar listeners após um pequeno delay para garantir que os refs estão prontos
    const timeoutId = setTimeout(addWheelListeners, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [handleWheelScroll]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        const key = e.key;
        if (key >= '1' && key <= '8') {
          e.preventDefault();
          const tabIndex = parseInt(key) - 1;
          if (tabs[tabIndex]) {
            onTabChange(tabs[tabIndex].id);
          }
        } else if (key.toLowerCase() === 'k') {
          e.preventDefault();
          setShowShortcuts(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange]);

  const handleTabHover = (tabId: string) => {
    if (onTabHover) {
      onTabHover(tabId);
    }

    switch (tabId) {
      case 'simulacao':
        hoverPreload.preloadSimulacao();
        break;
      case 'comparador':
        hoverPreload.preloadComparador();
        break;
      case 'historico':
        hoverPreload.preloadHistorico();
        break;
      case 'meta':
        hoverPreload.preloadMetas();
        break;
      case 'performance':
        hoverPreload.preloadPerformance();
        break;
      case 'cenarios':
        hoverPreload.preloadCenarios();
        break;
      case 'recomendacoes':
        hoverPreload.preloadRecomendacoes();
        break;
      case 'aposentadoria':
        hoverPreload.preloadSimulador();
        break;
    }
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);
  
  // Determinar se deve estar minimizado baseado no scroll
  const shouldMinimize = isMinimized || scrollY > 100;
  
  // Debug log para shouldMinimize
  console.log('shouldMinimize:', {
    isMinimized,
    scrollY,
    shouldMinimize
  });

  return (
    <motion.div 
      className={`w-full transition-all duration-300 ${className} ${shouldMinimize ? 'transform-gpu' : ''}`}
      animate={{
        scale: shouldMinimize ? 0.9 : 1,
        opacity: shouldMinimize ? 0.7 : 1,
        y: shouldMinimize ? -5 : 0,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.3
      }}
    >
      {/* Responsive Navigation Container */}
      <div className="relative w-full">
        {/* Keyboard Shortcuts Button - Top Right */}
        <div className="absolute top-0 right-0 z-10">
          <motion.button
            onClick={() => setShowShortcuts(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Atalhos de teclado (Ctrl+K)"
          >
            <Keyboard className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Atalhos</span>
          </motion.button>
        </div>

        {/* Navigation Tabs - Fully Responsive */}
        <div className="w-full pr-16 sm:pr-20">
          {/* Mobile Navigation (< 640px) */}
          <div className="block sm:hidden">
            <div className="relative">
              <nav 
                ref={mobileNavRef}
                className={`flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth pb-1 transition-all duration-300 ${
                  shouldMinimize ? 'py-1' : 'py-2'
                }`}
                style={{ 
                  cursor: 'grab',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.cursor = 'grabbing';
                  console.log('Mouse down em mobile nav');
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.cursor = 'grab';
                  console.log('Mouse up em mobile nav');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.cursor = 'grab';
                }}
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      relative flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-[60px] flex-shrink-0
                      ${activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    whileTap={{ scale: 0.95 }}
                    title={tab.description}
                  >
                    <div className="text-base">{tab.icon}</div>
                    <span className="text-center leading-tight text-[10px] font-medium">
                      {tab.label.split(' ')[0]}
                    </span>
                    
                    {/* Active indicator for mobile */}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
              
              {/* Scroll indicators for mobile */}
              <div className="absolute left-0 top-0 bottom-1 w-3 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none opacity-60"></div>
              <div className="absolute right-0 top-0 bottom-1 w-3 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none opacity-60"></div>
            </div>
          </div>

          {/* Tablet Navigation (640px - 1024px) */}
          <div className="hidden sm:block lg:hidden">
            <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300 ${
              shouldMinimize ? 'p-0.5' : 'p-1'
            }`}>
              <nav 
                ref={tabletNavRef}
                className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ 
                  cursor: 'grab',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.cursor = 'grabbing';
                  console.log('Mouse down em tablet nav');
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.cursor = 'grab';
                  console.log('Mouse up em tablet nav');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.cursor = 'grab';
                }}
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    onMouseEnter={() => handleTabHover(tab.id)}
                    className={`
                      relative flex items-center gap-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0
                      ${shouldMinimize ? 'px-2 py-1' : 'px-3 py-2'}
                      ${activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={`${tab.description} (Ctrl+${tab.shortcut})`}
                  >
                    {tab.icon}
                    <span className="text-sm">{tab.label.split(' ')[0]}</span>
                    
                    {/* Active indicator for tablet */}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabTablet"
                        className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-md"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Desktop Navigation (>= 1024px) */}
          <div className="hidden lg:block">
            <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-300 ${
              shouldMinimize ? 'p-0.5' : 'p-1'
            }`}>
              <nav 
                ref={desktopNavRef}
                className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ 
                  cursor: 'grab',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.cursor = 'grabbing';
                  console.log('Mouse down em desktop nav');
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.cursor = 'grab';
                  console.log('Mouse up em desktop nav');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.cursor = 'grab';
                }}
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    onMouseEnter={() => handleTabHover(tab.id)}
                    className={`
                      relative flex items-center gap-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                      ${shouldMinimize ? 'px-3 py-1.5' : 'px-4 py-2.5'}
                      ${activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={`${tab.description} (Ctrl+${tab.shortcut})`}
                  >
                    {tab.icon}
                    <span className={shouldMinimize ? 'hidden sm:inline' : ''}>{tab.label}</span>
                    {tab.shortcut && !shouldMinimize && (
                      <span className="text-xs opacity-60 ml-1 hidden xl:inline">
                        ⌘{tab.shortcut}
                      </span>
                    )}
                    
                    {/* Active indicator for desktop */}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabDesktop"
                        className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-md"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de atalhos */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${getZIndexClass('MODAL')} flex items-center justify-center p-4`}
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Atalhos de Teclado
                </h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {tabs.map((tab) => (
                  <div key={tab.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {tab.icon}
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {tab.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        Ctrl
                      </kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        {tab.shortcut}
                      </kbd>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Mostrar atalhos
                    </span>
                    <div className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        Ctrl
                      </kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        K
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default NavigationEnhanced;