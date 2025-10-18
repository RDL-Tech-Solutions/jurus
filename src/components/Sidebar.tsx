import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Shield,
  HelpCircle,
  BookOpen,
  BarChart3,
  FileText,
  TrendingUp,
  X,
  ChevronRight,
  Accessibility,
  Database,
  GraduationCap,
  LifeBuoy,
  Brain,
  Gamepad2,
  Palette,
  Calculator,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Z_INDEX } from '../constants/zIndex';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAccessibilityClick: () => void;
  onGlobalSettingsClick: () => void;
  onBackupClick: () => void;
  onTutorialClick: () => void;
  onHelpClick: () => void;
}

interface SidebarSection {
  title: string;
  icon: React.ReactNode;
  items: SidebarItem[];
}

interface SidebarItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onAccessibilityClick,
  onGlobalSettingsClick,
  onBackupClick,
  onTutorialClick,
  onHelpClick
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('Ferramentas');
  const navigate = useNavigate();

  // Persistir estado da sidebar no localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-open');
    if (savedState !== null) {
      // O estado é controlado pelo componente pai, apenas para referência
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-open', isOpen.toString());
  }, [isOpen]);

  // Atalho de teclado Ctrl+B para toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        onToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  // Auto-close em mobile após seleção
  const handleItemClick = useCallback((onClick: () => void) => {
    onClick();
    if (window.innerWidth < 1024) { // lg breakpoint
      onToggle();
    }
  }, [onToggle]);

  const sections: SidebarSection[] = [
    {
      title: 'Navegação Principal',
      icon: <Home className="w-5 h-5" />,
      items: [
        {
          id: 'home',
          title: 'Início',
          description: 'Página inicial do sistema',
          icon: <Home className="w-4 h-4" />,
          onClick: () => navigate('/'),
          shortcut: 'Ctrl+H'
        },
        {
          id: 'calculadora',
          title: 'Calculadora',
          description: 'Calculadora de juros compostos',
          icon: <Calculator className="w-4 h-4" />,
          onClick: () => navigate('/'),
          shortcut: 'Ctrl+C'
        }
      ]
    },
    {
      title: 'Dashboards',
      icon: <BarChart3 className="w-5 h-5" />,
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard Básico',
          description: 'Visão geral dos dados',
          icon: <BarChart3 className="w-4 h-4" />,
          onClick: () => navigate('/dashboard'),
        },
        {
          id: 'dashboard-executivo',
          title: 'Dashboard Executivo',
          description: 'Dashboard para executivos',
          icon: <TrendingUp className="w-4 h-4" />,
          onClick: () => navigate('/dashboard-executivo'),
        },
        {
          id: 'dashboard-avancado',
          title: 'Dashboard Avançado',
          description: 'Dashboard executivo avançado',
          icon: <BarChart3 className="w-4 h-4" />,
          onClick: () => navigate('/dashboard-executivo-avancado'),
        }
      ]
    },
    {
      title: 'Ferramentas',
      icon: <FileText className="w-5 h-5" />,
      items: [
        {
          id: 'relatorios-avancados',
          title: 'Relatórios Avançados',
          description: 'Relatórios detalhados e análises',
          icon: <FileText className="w-4 h-4" />,
          onClick: () => navigate('/relatorios-avancados'),
        },
        {
          id: 'recomendacoes-ia',
          title: 'Recomendações IA',
          description: 'Recomendações inteligentes',
          icon: <Brain className="w-4 h-4" />,
          onClick: () => navigate('/recomendacoes-ia'),
        },
        {
          id: 'simulador-cenarios',
          title: 'Simulador de Cenários',
          description: 'Simular diferentes cenários',
          icon: <Gamepad2 className="w-4 h-4" />,
          onClick: () => navigate('/simulador-cenarios'),
        }
      ]
    },
    {
      title: 'Sistema',
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          id: 'sistema-temas',
          title: 'Sistema de Temas',
          description: 'Personalizar aparência',
          icon: <Palette className="w-4 h-4" />,
          onClick: () => navigate('/sistema-temas'),
        },
        {
          id: 'sistema-educacao',
          title: 'Sistema de Educação',
          description: 'Educação financeira',
          icon: <GraduationCap className="w-4 h-4" />,
          onClick: () => navigate('/sistema-educacao'),
        }
      ]
    },
    {
      title: 'Configurações',
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          id: 'global-settings',
          title: 'Configurações Globais',
          description: 'Preferências gerais do sistema',
          icon: <Settings className="w-4 h-4" />,
          onClick: onGlobalSettingsClick,
          shortcut: 'Ctrl+,'
        },
        {
          id: 'accessibility',
          title: 'Acessibilidade',
          description: 'Opções de acessibilidade',
          icon: <Accessibility className="w-4 h-4" />,
          onClick: onAccessibilityClick,
          shortcut: 'Alt+A'
        },
        {
          id: 'backup',
          title: 'Backup e Restauração',
          description: 'Gerenciar dados e backups',
          icon: <Database className="w-4 h-4" />,
          onClick: onBackupClick,
          shortcut: 'Ctrl+B'
        }
      ]
    },
    {
      title: 'Ajuda & Suporte',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        {
          id: 'help',
          title: 'Ajuda Contextual',
          description: 'Obter ajuda sobre funcionalidades',
          icon: <LifeBuoy className="w-4 h-4" />,
          onClick: onHelpClick,
          shortcut: 'F1'
        },
        {
          id: 'tutorial',
          title: 'Tutorial',
          description: 'Guia passo a passo',
          icon: <GraduationCap className="w-4 h-4" />,
          onClick: onTutorialClick,
          shortcut: 'Ctrl+?'
        },
        {
          id: 'documentation',
          title: 'Documentação',
          description: 'Manual completo do usuário',
          icon: <BookOpen className="w-4 h-4" />,
          onClick: () => window.open('/docs', '_blank'),
        }
      ]
    }
  ];

  const toggleSection = (sectionTitle: string) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.2 }
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay para mobile */}
          <motion.div
            className="fixed inset-0 bg-black/50 lg:hidden"
            style={{ zIndex: Z_INDEX.BASE }}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onToggle}
          />

          {/* Sidebar */}
          <motion.aside
            className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl lg:shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col"
            style={{ zIndex: Z_INDEX.SIDEBAR }}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header da Sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Menu de Navegação
              </h2>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Fechar menu lateral"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Conteúdo da Sidebar */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sections.map((section) => (
                <div key={section.title} className="space-y-1">
                  {/* Cabeçalho da Seção */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {section.icon}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {section.title}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedSection === section.title ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Items da Seção */}
                  <AnimatePresence>
                    {expandedSection === section.title && (
                      <motion.div
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="ml-4 space-y-1"
                      >
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item.onClick)}
                            className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group text-left"
                          >
                            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors mt-0.5">
                              {item.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                                  {item.title}
                                </p>
                                {item.shortcut && (
                                  <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    {item.shortcut}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Footer da Sidebar */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                <p>Pressione <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+B</kbd> para alternar</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;