/**
 * Sistema hierárquico de z-index para organizar camadas de elementos
 * Valores organizados de forma crescente para evitar conflitos
 */

export const Z_INDEX = {
  // Elementos base (0-9)
  BASE: 0,
  CONTENT: 1,
  
  // Elementos de navegação (10-19)
  NAVIGATION: 10,
  BREADCRUMBS: 11,
  TABS: 12,
  
  // Elementos de interface (20-29)
  SIDEBAR: 20,
  DROPDOWN: 25,
  
  // Elementos fixos (30-39)
  STICKY_HEADER: 30,
  HEADER_BUTTONS: 35,
  FLOATING_BUTTONS: 38,
  
  // Elementos de overlay baixo (40-49)
  BACKDROP: 40,
  LOADING_OVERLAY: 45,
  
  // Modais e painéis (50-69)
  MODAL_BACKDROP: 50,
  SIDE_PANEL: 52,
  NOTIFICATION_PANEL: 53,
  SETTINGS_PANEL: 54,
  MODAL: 55,
  PROFILE_PANEL: 56,
  BACKUP_PANEL: 57,
  
  // Elementos interativos (70-79)
  POPOVER: 70,
  CONTEXT_MENU: 75,
  
  // Elementos de feedback (80-89)
  TOOLTIP: 80,
  TOAST: 85,
  
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
 */
export const getZIndexClass = (level: keyof typeof Z_INDEX): string => {
  const value = Z_INDEX[level];
  
  // Mapeamento para classes Tailwind CSS
  const tailwindMap: Record<number, string> = {
    0: 'z-0',
    1: 'z-10',
    10: 'z-10',
    11: 'z-10',
    12: 'z-10',
    20: 'z-20',
    25: 'z-20',
    30: 'z-30',
    35: 'z-30',
    40: 'z-40',
    45: 'z-40',
    50: 'z-50',
    52: 'z-50',
    53: 'z-50',
    54: 'z-50',
    55: 'z-50',
    70: 'z-50',
    75: 'z-50',
    80: 'z-50',
    85: 'z-50',
    90: 'z-50',
    92: 'z-50',
    95: 'z-50',
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
 * Tipos para TypeScript
 */
export type ZIndexLevel = keyof typeof Z_INDEX;