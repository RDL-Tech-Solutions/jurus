import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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
import { getZIndexClass, Z_INDEX } from '../constants/zIndex';

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
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Detectar tema escuro
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
      console.log('🎨 Tema detectado:', isDark ? 'ESCURO' : 'CLARO');
    };
    
    checkDarkMode();
    
    // Observer para mudanças no tema
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Debug da sidebar
  useEffect(() => {
    if (isOpen) {
      console.log('🔧 SIDEBAR DEBUG:', {
        isOpen,
        isDarkMode,
        isMobile,
        expandedSection,
        sidebarRef: sidebarRef.current
      });
      

    }
  }, [isOpen, isDarkMode, isMobile, expandedSection]);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Fechar sidebar ao clicar fora (apenas em mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isOpen && isMobile) {
      // Adicionar delay para evitar fechamento imediato
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, isMobile, onToggle]);

  // Fechar sidebar com ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onToggle]);

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

  // Prevenir scroll do body quando sidebar está aberta em mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile, isOpen]);

  // Auto-close em mobile após seleção
  const handleItemClick = useCallback((onClick: () => void) => {
    onClick();
    if (isMobile) {
      // Pequeno delay para melhor UX
      setTimeout(() => {
        onToggle();
      }, 150);
    }
  }, [isMobile, onToggle]);

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
          shortcut: 'Ctrl+Shift+B'
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

  const sidebarVariants: Variants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
        duration: 0.3
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
        duration: 0.3
      }
    }
  };

  const overlayVariants: Variants = {
    open: {
      opacity: 1,
      transition: { 
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    closed: {
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  const itemVariants: Variants = {
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
    <>
      {isOpen && (
        <>
          {/* Overlay simplificado apenas para mobile */}
          {isMobile && (
            <div
              onClick={onToggle}
              style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: '9998',
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
            />
          )}

          {/* Sidebar */}
          <aside
            ref={sidebarRef}
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              height: '100vh',
              width: isMobile ? '320px' : '320px',
              maxWidth: isMobile ? '85vw' : 'none',
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              borderRight: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              zIndex: '9999',
              pointerEvents: 'auto',
              opacity: '1',
              overflow: 'hidden'
            }}
          >
            {/* Header da Sidebar */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderBottom: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                pointerEvents: 'auto'
              }}
            >
              <h2 
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: isDarkMode ? '#ffffff' : '#111827',
                  margin: '0'
                }}
              >
                Menu de Navegação
              </h2>
              <button
                onClick={onToggle}
                aria-label="Fechar menu lateral"
                style={{ 
                  pointerEvents: 'auto',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X 
                  style={{
                    width: '20px',
                    height: '20px',
                    color: isDarkMode ? '#9ca3af' : '#6b7280'
                  }}
                />
              </button>
            </div>

            {/* Conteúdo da Sidebar */}
            <div 
              style={{
                flex: '1',
                overflowY: 'auto',
                padding: '16px',
                pointerEvents: 'auto',
                backgroundColor: 'transparent'
              }}
            >
              {sections.map((section) => (
                <div key={section.title} style={{ marginBottom: '8px' }}>
                  {/* Cabeçalho da Seção */}
                  <button
                      onClick={() => toggleSection(section.title)}
                      style={{ 
                        pointerEvents: 'auto',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        textAlign: 'left',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        marginBottom: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                        {section.icon}
                      </span>
                      <span style={{ 
                        fontWeight: '500', 
                        color: isDarkMode ? '#ffffff' : '#111827' 
                      }}>
                        {section.title}
                      </span>
                    </div>
                    <ChevronRight
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#9ca3af',
                        transform: expandedSection === section.title ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>

                  {/* Items da Seção */}
                  {expandedSection === section.title && (
                    <div style={{ marginLeft: '16px', marginTop: '4px' }}>
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item.onClick)}
                            style={{ 
                              pointerEvents: 'auto',
                              width: '100%',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              padding: '12px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'background-color 0.2s ease',
                              marginBottom: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#f9fafb';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <span style={{ 
                              color: isDarkMode ? '#9ca3af' : '#6b7280',
                              marginTop: '2px',
                              flexShrink: 0,
                              width: '16px',
                              height: '16px'
                            }}>
                              {item.icon}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ 
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  color: isDarkMode ? '#ffffff' : '#111827',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {item.title}
                                </p>
                                {item.shortcut && (
                                  <span style={{ 
                                    fontSize: '12px',
                                    color: isDarkMode ? '#6b7280' : '#9ca3af',
                                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    marginLeft: '8px',
                                    flexShrink: 0
                                  }}>
                                    {item.shortcut}
                                  </span>
                                )}
                              </div>
                              <p style={{ 
                                fontSize: '12px',
                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                                marginTop: '4px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {item.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Footer da Sidebar */}
            <div style={{
                padding: '16px',
                borderTop: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ 
                fontSize: '12px',
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                textAlign: 'center'
              }}>
                <p>
                  Pressione{' '}
                  <kbd style={{ 
                    padding: '2px 6px',
                    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                    borderRadius: '4px',
                    color: isDarkMode ? '#d1d5db' : '#374151',
                    fontFamily: 'monospace'
                  }}>
                    Ctrl+B
                  </kbd>{' '}
                  para alternar
                </p>
                {isMobile && (
                  <p style={{ 
                    color: isDarkMode ? '#6b7280' : '#9ca3af',
                    marginTop: '4px'
                  }}>
                    Deslize para a esquerda ou toque fora para fechar
                  </p>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;