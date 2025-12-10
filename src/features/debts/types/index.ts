/**
 * Tipos específicos do módulo de Dívidas
 */

import { Divida } from '../../../types/fluxoCaixa';

export type DebtStatus = 'all' | 'paid' | 'overdue' | 'active' | 'upcoming';
export type DebtType = 'all' | 'credit_card' | 'loan' | 'installment' | 'personal';
export type DebtSortBy = 'due_date' | 'value_desc' | 'value_asc' | 'status';

export interface DebtFilters {
  status: DebtStatus;
  type: DebtType;
  month?: string; // YYYY-MM
  search: string;
  sortBy: DebtSortBy;
}

export interface DebtSummary {
  totalDebts: number;
  totalOverdue: number;
  totalUpcoming: number;
  totalPaid: number;
  quantityPending: number;
  quantityPaid: number;
  quantityOverdue: number;
  quantityUpcoming: number;
}

export interface DebtWithStatus extends Divida {
  status: 'paid' | 'overdue' | 'upcoming' | 'active';
  daysUntilDue?: number;
  isOverdue: boolean;
  progressPercentage?: number; // Para parceladas
}

export interface DebtAlert {
  id: string;
  type: 'due_today' | 'due_soon' | 'overdue' | 'progress';
  title: string;
  message: string;
  debtId: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}
