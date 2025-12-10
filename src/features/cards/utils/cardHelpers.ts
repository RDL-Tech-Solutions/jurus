/**
 * Funções auxiliares para cartões
 */

import { CartaoCredito, GastoCartao, Fatura } from '../../../types/fluxoCaixa';
import { CardWithStats, BrandInfo, CARD_BRANDS } from '../types';

/**
 * Calcula limite disponível do cartão
 */
export function calculateAvailableLimit(card: CartaoCredito, gastos: GastoCartao[]): number {
  const gastosDoCartao = gastos.filter(g => g.cartaoId === card.id);
  const totalGasto = gastosDoCartao.reduce((sum, g) => sum + g.valorParcela, 0);
  return Math.max(0, card.limite - totalGasto);
}

/**
 * Calcula percentual de limite utilizado
 */
export function calculateUsedPercentage(limite: number, usado: number): number {
  if (limite === 0) return 0;
  return Math.min(100, (usado / limite) * 100);
}

/**
 * Determina status do limite
 */
export function getLimitStatus(percentual: number): 'healthy' | 'warning' | 'critical' {
  if (percentual >= 90) return 'critical';
  if (percentual >= 70) return 'warning';
  return 'healthy';
}

/**
 * Enriquece cartão com estatísticas
 */
export function enrichCardWithStats(
  card: CartaoCredito,
  gastos: GastoCartao[],
  faturaAtual: Fatura | null,
  proximaFatura: Fatura | null
): CardWithStats {
  const limiteDisponivel = calculateAvailableLimit(card, gastos);
  const limiteUtilizado = card.limite - limiteDisponivel;
  const percentualUtilizado = calculateUsedPercentage(card.limite, limiteUtilizado);
  const statusLimite = getLimitStatus(percentualUtilizado);
  
  return {
    ...card,
    limiteDisponivel,
    limiteUtilizado,
    percentualUtilizado,
    statusLimite,
    faturaAtual,
    proximaFatura
  };
}

/**
 * Obtém informações da bandeira
 */
export function getBrandInfo(brandId: string): BrandInfo {
  return CARD_BRANDS.find(b => b.id === brandId) || CARD_BRANDS[CARD_BRANDS.length - 1];
}

/**
 * Formata número do cartão (últimos 4 dígitos)
 */
export function formatCardNumber(cardName: string): string {
  // Extrai últimos 4 dígitos se houver
  const match = cardName.match(/\d{4}$/);
  return match ? `•••• ${match[0]}` : cardName;
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Calcula dias até vencimento
 */
export function calculateDaysUntilDue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Verifica se fatura está vencida
 */
export function isInvoiceOverdue(dueDate: string): boolean {
  return calculateDaysUntilDue(dueDate) < 0;
}

/**
 * Formata data para exibição
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Formata data relativa
 */
export function formatRelativeDate(date: string): string {
  const days = calculateDaysUntilDue(date);
  
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Amanhã';
  if (days === -1) return 'Ontem';
  if (days < 0) return `${Math.abs(days)} dias atrás`;
  if (days <= 7) return `Em ${days} dias`;
  
  return formatDate(date);
}

/**
 * Obtém cor do status do limite
 */
export function getLimitStatusColor(status: 'healthy' | 'warning' | 'critical'): {
  bg: string;
  text: string;
  bar: string;
} {
  const colors = {
    healthy: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      text: 'text-green-700 dark:text-green-300',
      bar: 'bg-green-500'
    },
    warning: {
      bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      text: 'text-orange-700 dark:text-orange-300',
      bar: 'bg-orange-500'
    },
    critical: {
      bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
      text: 'text-red-700 dark:text-red-300',
      bar: 'bg-red-500'
    }
  };
  
  return colors[status];
}
