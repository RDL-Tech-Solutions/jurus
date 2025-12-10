/**
 * Export principal do módulo de dívidas
 */

export * from './components';
export { useDebts } from './hooks/useDebts';
export { useDebtFilters } from './hooks/useDebtFilters';
export type { DebtWithStatus, DebtSummary, DebtFilters, DebtAlert } from './types';
