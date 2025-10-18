import { useState, useEffect, useCallback, useRef } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  lineHeight: 'normal' | 'relaxed' | 'loose';
  letterSpacing: 'normal' | 'wide' | 'wider';
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  focusIndicators: true,
  colorBlindMode: 'none',
  fontSize: 'medium',
  lineHeight: 'normal',
  letterSpacing: 'normal'
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcementTimeoutRef = useRef<NodeJS.Timeout>();

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Detectar preferências do sistema
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detectar preferência por movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }

    // Detectar preferência por alto contraste
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    if (prefersHighContrast.matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }

    // Detectar leitor de tela
    const hasScreenReader = window.navigator.userAgent.includes('NVDA') || 
                           window.navigator.userAgent.includes('JAWS') || 
                           window.speechSynthesis;
    if (hasScreenReader) {
      setSettings(prev => ({ ...prev, screenReader: true }));
    }
  }, []);

  // Aplicar estilos CSS baseados nas configurações
  useEffect(() => {
    const root = document.documentElement;

    // Alto contraste
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Movimento reduzido
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Tamanho da fonte
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${settings.fontSize}`);

    // Altura da linha
    root.classList.remove('line-height-normal', 'line-height-relaxed', 'line-height-loose');
    root.classList.add(`line-height-${settings.lineHeight}`);

    // Espaçamento entre letras
    root.classList.remove('letter-spacing-normal', 'letter-spacing-wide', 'letter-spacing-wider');
    root.classList.add(`letter-spacing-${settings.letterSpacing}`);

    // Modo daltônico
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (settings.colorBlindMode !== 'none') {
      root.classList.add(settings.colorBlindMode);
    }

    // Indicadores de foco
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
  }, [settings]);

  // Função para atualizar configurações
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Função para anunciar para leitores de tela
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);

    // Limpar anúncio após um tempo
    if (announcementTimeoutRef.current) {
      clearTimeout(announcementTimeoutRef.current);
    }

    announcementTimeoutRef.current = setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 3000);

    // Usar Speech Synthesis API se disponível
    if ('speechSynthesis' in window && settings.screenReader) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [settings.screenReader]);

  // Navegação por teclado
  const useKeyboardNavigation = () => {
    useEffect(() => {
      if (!settings.keyboardNavigation) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        // Esc para fechar modais
        if (event.key === 'Escape') {
          const activeModal = document.querySelector('[role="dialog"]');
          if (activeModal) {
            const closeButton = activeModal.querySelector('[aria-label*="fechar"], [aria-label*="close"]') as HTMLElement;
            closeButton?.click();
          }
        }

        // Tab para navegação
        if (event.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }

        // Enter/Space para ativar elementos
        if (event.key === 'Enter' || event.key === ' ') {
          const target = event.target as HTMLElement;
          if (target.getAttribute('role') === 'button' || target.tagName === 'BUTTON') {
            event.preventDefault();
            target.click();
          }
        }

        // Setas para navegação em listas
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          const target = event.target as HTMLElement;
          const listbox = target.closest('[role="listbox"]');
          if (listbox) {
            event.preventDefault();
            const items = Array.from(listbox.querySelectorAll('[role="option"]')) as HTMLElement[];
            const currentIndex = items.indexOf(target);
            const nextIndex = event.key === 'ArrowDown' 
              ? Math.min(currentIndex + 1, items.length - 1)
              : Math.max(currentIndex - 1, 0);
            items[nextIndex]?.focus();
          }
        }
      };

      const handleMouseDown = () => {
        document.body.classList.remove('keyboard-navigation');
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleMouseDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleMouseDown);
      };
    }, [settings.keyboardNavigation]);
  };

  // Hook para gerenciar foco
  const useFocusManagement = () => {
    const focusRef = useRef<HTMLElement | null>(null);

    const trapFocus = useCallback((container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      container.addEventListener('keydown', handleKeyDown);
      firstElement?.focus();

      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    const restoreFocus = useCallback(() => {
      if (focusRef.current) {
        focusRef.current.focus();
        focusRef.current = null;
      }
    }, []);

    const saveFocus = useCallback(() => {
      focusRef.current = document.activeElement as HTMLElement;
    }, []);

    return { trapFocus, restoreFocus, saveFocus };
  };

  // Hook para validação de acessibilidade
  const useAccessibilityValidation = () => {
    const validateElement = useCallback((element: HTMLElement) => {
      const issues: string[] = [];

      // Verificar alt text em imagens
      const images = element.querySelectorAll('img');
      images.forEach(img => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          issues.push(`Imagem sem texto alternativo: ${img.src}`);
        }
      });

      // Verificar labels em inputs
      const inputs = element.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const id = input.id;
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledby = input.getAttribute('aria-labelledby');

        if (!label && !ariaLabel && !ariaLabelledby) {
          issues.push(`Input sem label: ${input.tagName}`);
        }
      });

      // Verificar contraste de cores
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;

      // Verificar headings hierárquicos
      const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          issues.push(`Hierarquia de heading incorreta: ${heading.tagName} após h${lastLevel}`);
        }
        lastLevel = level;
      });

      return issues;
    }, []);

    return { validateElement };
  };

  return {
    settings,
    updateSetting,
    announce,
    announcements,
    useKeyboardNavigation,
    useFocusManagement,
    useAccessibilityValidation
  };
};

// Hook para skip links
export const useSkipLinks = () => {
  const skipLinks = [
    { href: '#main-content', label: 'Pular para o conteúdo principal' },
    { href: '#navigation', label: 'Pular para a navegação' },
    { href: '#footer', label: 'Pular para o rodapé' }
  ];

  return { skipLinks };
};

// Hook para landmarks ARIA
export const useLandmarks = () => {
  useEffect(() => {
    // Adicionar landmarks automaticamente se não existirem
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
      main.setAttribute('aria-label', 'Conteúdo principal');
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Navegação principal');
    }

    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
      footer.setAttribute('aria-label', 'Informações do rodapé');
    }
  }, []);
}