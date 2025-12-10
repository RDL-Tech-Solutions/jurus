/**
 * Tipos específicos do módulo de Cartões
 */

import { CartaoCredito, GastoCartao, Fatura } from '../../../types/fluxoCaixa';

export interface CardWithStats extends CartaoCredito {
  limiteDisponivel: number;
  limiteUtilizado: number;
  percentualUtilizado: number;
  statusLimite: 'healthy' | 'warning' | 'critical';
  faturaAtual: Fatura | null;
  proximaFatura: Fatura | null;
}

export interface CardSummaryData {
  totalCards: number;
  totalLimit: number;
  totalAvailable: number;
  totalUsed: number;
  totalInvoices: number;
  activeCards: number;
}

export interface InvoiceWithDetails extends Fatura {
  isPaid: boolean;
  isOverdue: boolean;
  daysUntilDue?: number;
}

export type CardFilter = 'all' | 'active' | 'inactive';
export type CardSortBy = 'name' | 'limit' | 'used' | 'available';

export interface CardFilters {
  filter: CardFilter;
  sortBy: CardSortBy;
  search: string;
}

export interface BrandInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CARD_BRANDS: BrandInfo[] = [
  { id: 'visa', name: 'Visa', icon: '💳', color: '#1A1F71' },
  { id: 'mastercard', name: 'Mastercard', icon: '💳', color: '#EB001B' },
  { id: 'elo', name: 'Elo', icon: '💳', color: '#FFCB05' },
  { id: 'amex', name: 'American Express', icon: '💳', color: '#006FCF' },
  { id: 'hipercard', name: 'Hipercard', icon: '💳', color: '#E31E24' },
  { id: 'outro', name: 'Outro', icon: '💳', color: '#6B7280' }
];
