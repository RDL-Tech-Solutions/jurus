/**
 * Sistema hierárquico de z-index para organizar camadas de elementos
 * Valores organizados de forma crescente para evitar conflitos
 * 
 * Estrutura hierárquica:
 * 0-9: Elementos base
 * 10-19: Navegação
 * 20-29: Elementos de interface
 * 30-39: Elementos fixos
 * 40-49: Overlays baixos
 * 50-69: Modais e painéis
 * 70-79: Elementos interativos
 * 80-89: Feedback
 * 90-99: Elementos críticos
 * 100+: Máxima prioridade
 */

export const Z_INDEX = {
  // Elementos base (0-9)
  BASE: 0,
  CONTENT: 1,
  BACKGROUND: 2,
  
  // Elementos de navegação (10-19)
  NAVIGATION: 10,
  BREADCRUMBS: 11,
  TABS: 12,
  NAV_DROPDOWN: 15,
  
  // Elementos de interface (20-29)
  SIDEBAR: 20,
  DROPDOWN: 25,
  MENU: 26,
  
  // Elementos fixos (30-39)
  STICKY_HEADER: 30,
  FIXED_HEADER: 32,
  HEADER_BUTTONS: 35,
  FLOATING_BUTTONS: 38,
  
  // Elementos de overlay baixo (40-49)
  BACKDROP: 40,
  OVERLAY: 45,
  LOADING_OVERLAY: 47,
  
  // Modais e painéis (50-69)
  MODAL_BACKDROP: 50,
  SIDE_PANEL: 52,
  NOTIFICATION_PANEL: 53,
  SETTINGS_PANEL: 54,
  MODAL: 55,
  PROFILE_PANEL: 56,
  BACKUP_PANEL: 57,
  ACCESSIBILITY_PANEL: 58,
  
  // Elementos interativos (70-79)
  POPOVER: 70,
  CONTEXT_MENU: 75,
  AUTOCOMPLETE: 76,
  
  // Elementos de feedback (80-89)
  TOOLTIP: 80,
  TOAST: 85,
  NOTIFICATION: 87,
  
  // Elementos críticos (90-99)
  TUTORIAL_OVERLAY: 90,
  CONTEXTUAL_HELP: 91,
  ACCESSIBILITY_OVERLAY: 92,
  ONBOARDING: 93,
  ERROR_BOUNDARY: 95,
  
  // Elementos de máxima prioridade (100+)
  EMERGENCY_MODAL: 100,
  SYSTEM_ALERT: 110,
} as const;

/**
 * Utilitário para obter classes Tailwind de z-index
 * Mapeamento otimizado para evitar conflitos
 */
export const getZIndexClass = (level: keyof typeof Z_INDEX): string => {
  const value = Z_INDEX[level];
  
  // Mapeamento para classes Tailwind CSS com melhor distribuição
  const tailwindMap: Record<number, string> = {
    // Base
    0: 'z-0',
    1: 'z-10',
    2: 'z-10',
    
    // Navegação
    10: 'z-10',
    11: 'z-10',
    12: 'z-10',
    15: 'z-10',
    
    // Interface
    20: 'z-20',
    25: 'z-20',
    26: 'z-20',
    
    // Fixos
    30: 'z-30',
    32: 'z-30',
    35: 'z-30',
    38: 'z-30',
    
    // Overlays
    40: 'z-40',
    45: 'z-40',
    47: 'z-40',
    
    // Modais e painéis
    50: 'z-50',
    52: 'z-50',
    53: 'z-50',
    54: 'z-50',
    55: 'z-50',
    56: 'z-50',
    57: 'z-50',
    58: 'z-50',
    
    // Interativos
    70: 'z-50',
    75: 'z-50',
    76: 'z-50',
    
    // Feedback
    80: 'z-50',
    85: 'z-50',
    87: 'z-50',
    
    // Críticos
    90: 'z-50',
    91: 'z-50',
    92: 'z-50',
    93: 'z-50',
    95: 'z-50',
    
    // Máxima prioridade
    100: 'z-50',
    110: 'z-50',
  };
  
  return tailwindMap[value] || 'z-50';
};

/**
 * Utilitário para obter valor numérico de z-index para uso em estilos inline
 */
export const getZIndexValue = (level: keyof typeof Z_INDEX): number => {
  return Z_INDEX[level];
};

/**
 * Utilitário para verificar se um z-index é maior que outro
 */
export const isZIndexHigher = (level1: keyof typeof Z_INDEX, level2: keyof typeof Z_INDEX): boolean => {
  return Z_INDEX[level1] > Z_INDEX[level2];
};

/**
 * Utilitário para obter o próximo z-index disponível em uma categoria
 */
export const getNextZIndex = (baseLevel: keyof typeof Z_INDEX, offset: number = 1): number => {
  return Z_INDEX[baseLevel] + offset;
};

/**
 * Configurações específicas para componentes de navegação
 */
export const NAVIGATION_Z_INDEX = {
  HEADER: Z_INDEX.FIXED_HEADER,
  SIDEBAR: Z_INDEX.SIDEBAR,
  SIDEBAR_OVERLAY: Z_INDEX.OVERLAY,
  NAVIGATION_TABS: Z_INDEX.NAVIGATION,
  BREADCRUMBS: Z_INDEX.BREADCRUMBS,
  DROPDOWN_MENU: Z_INDEX.NAV_DROPDOWN,
} as const;

/**
 * Configurações específicas para modais e overlays
 */
export const MODAL_Z_INDEX = {
  BACKDROP: Z_INDEX.MODAL_BACKDROP,
  CONTENT: Z_INDEX.MODAL,
  CLOSE_BUTTON: Z_INDEX.MODAL + 1,
  TOOLTIP: Z_INDEX.TOOLTIP,
} as const;

/**
 * Tipos para TypeScript
 */
export type ZIndexLevel = keyof typeof Z_INDEX;
export type NavigationZIndexLevel = keyof typeof NAVIGATION_Z_INDEX;
export type ModalZIndexLevel = keyof typeof MODAL_Z_INDEX;